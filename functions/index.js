const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const express = require('express');
const app = express();
const pdf = require('html-pdf');
const agreementTemplate = require('./agreementTemplate');
const bucket = admin.storage().bucket('gs://stilt-ws.appspot.com');
const path = require('path');
const os = require('os');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.sendWelcomeNotification = functions.firestore
  .document('users/{userID}')
  .onCreate(async snap => {
    const data = snap.data(),
      payload = {
        notification: {
          title: 'Welcome',
          body: 'Thanks for installing Stilt',
        },
      };
    await admin
      .firestore()
      .collection('notifications')
      .doc()
      .set({
        notification: payload.notification,
        members: [snap.data().mobile],
        createdAt: new Date(),
      });
    return admin
      .messaging()
      .sendToDevice(data.notificationToken, payload)
      .then(function(response) {
        console.log('Notification sent successfully:', response);
      })
      .catch(function(error) {
        console.log('Notification sent failed:', error);
      });
  });

exports.sendUpdateAccountNotification = functions.firestore
  .document('users/{userID}')
  .onUpdate(async change => {
    const data = change.after.data(),
      oldData = change.before.data(),
      payload = {
        notification: {
          title: 'Account Updated',
          body: 'Your information has been updated',
        },
      };
    //No notification for updating notification token
    if (oldData.notificationToken !== data.notificationToken) {
      return 0;
    }
    await admin
      .firestore()
      .collection('notifications')
      .doc()
      .set({
        notification: payload.notification,
        members: [data.mobile],
        createdAt: new Date(),
      });
    return admin
      .messaging()
      .sendToDevice(data.notificationToken, payload)
      .then(function(response) {
        console.log('Notification sent successfully:', response);
      })
      .catch(function(error) {
        console.log('Notification sent failed:', error);
      });
  });

exports.sendTransactionsNotifications = functions.firestore
  .document('transactions/{transactionID}')
  .onWrite(async change => {
    const document = change.after.exists ? change.after.data() : null;
    const payeeUser = await admin
      .firestore()
      .collection('users')
      .where('mobile', '==', document.payee.mobile)
      .get();
    const payeeNotificationToken = !payeeUser.empty
      ? payeeUser.docs[0].data().notificationToken
      : null;
    const payerUser = await admin
      .firestore()
      .collection('users')
      .where('mobile', '==', document.payer.mobile)
      .get();
    const payerNotificationToken = !payerUser.empty
      ? payerUser.docs[0].data().notificationToken
      : null;
    let payeePayload, payerPayload;

    if (document.type && document.paymentStatus === 'In Progress') {
      payeePayload = {
        notification: {
          title: `${document.service} Payment`,
          body: `You have requested ₹${document.payment} from ${
            document.payer.name
          } for ${document.service}`,
        },
      };
      payerPayload = {
        notification: {
          title: `${document.service} Payment`,
          body: `You have been requested to pay ₹${document.payment} by ${
            document.payee.name
          } for ${document.service}`,
        },
      };
    } else {
      payeePayload = {
        notification: {
          title: `${document.service} Payment`,
          body: `You have been paid ₹${document.payment} by ${
            document.payer.name
          } for ${document.service}`,
        },
      };
      payerPayload = {
        notification: {
          title: `${document.service} Payment`,
          body: `You have paid ₹${document.payment} to ${
            document.payee.name
          } for ${document.service}`,
        },
      };
    }
    if (payerNotificationToken) {
      await admin
        .firestore()
        .collection('notifications')
        .doc()
        .set({
          notification: payerPayload.notification,
          members: [document.payer.mobile],
          createdAt: new Date(),
        });
      admin
        .messaging()
        .sendToDevice(payerNotificationToken, payerPayload)
        .then(function(response) {
          console.log('Notification sent successfully:', response);
        })
        .catch(function(error) {
          console.log('Notification sent failed:', error);
        });
    }

    if (payeeNotificationToken) {
      await admin
        .firestore()
        .collection('notifications')
        .doc()
        .set({
          notification: payeePayload.notification,
          members: [document.payee.mobile],
          createdAt: new Date(),
        });
      admin
        .messaging()
        .sendToDevice(payeeNotificationToken, payeePayload)
        .then(function(response) {
          console.log('Notification sent successfully:', response);
        })
        .catch(function(error) {
          console.log('Notification sent failed:', error);
        });
    }
    return 0;
  });

exports.sendPropertyNotification = functions.firestore
  .document('property/{propertyID}')
  .onWrite(async change => {
    const document = change.after.exists ? change.after.data() : null;
    const oldDocument = change.before.data();
    if (change.before.exists) {
      //For party member
      //When party member added
      if (document.party.length > oldDocument.party.length) {
        //For older party members
        let oldPartiesMobile = oldDocument.party.map(p => p.mobile);
        const getOldParty = await admin
          .firestore()
          .collection('users')
          .where('mobile', 'in', oldPartiesMobile)
          .get();
        if (!getOldParty.empty) {
          const getOldPartyToken = getOldParty.docs
            .filter(p => p.data().notificationToken)
            .map(party => party.data().notificationToken);

          if (getOldPartyToken.length) {
            const partyNotification = {
              notification: {
                title: 'New Party Member Added',
                body: `${
                  document.party[document.party.length - 1].name
                } has been added as a ${
                  document.party[document.party.length - 1].role
                } for ${document.property.name}`,
              },
            };
            await admin
              .firestore()
              .collection('notifications')
              .doc()
              .set({
                notification: partyNotification.notification,
                members: [...oldPartiesMobile],
                createdAt: new Date(),
              });
            admin
              .messaging()
              .sendToDevice(getOldPartyToken, partyNotification)
              .then(function(response) {
                console.log('Notification sent successfully:', response);
              })
              .catch(function(error) {
                console.log('Notification sent failed:', error);
              });
          }
        }

        //For new party member
        const newPartyUser = await admin
          .firestore()
          .collection('users')
          .where(
            'mobile',
            '==',
            document.party[document.party.length - 1].mobile,
          )
          .get();
        const newPartyUserToken = !newPartyUser.empty
          ? newPartyUser.docs[0].data().notificationToken
          : null;
        if (newPartyUserToken) {
          const notification = {
            notification: {
              title: 'New Party Member Added',
              body: `You have been added as a ${
                document.party[document.party.length - 1].role
              } for ${document.property.name}`,
            },
          };
          await admin
            .firestore()
            .collection('notifications')
            .doc()
            .set({
              notification: notification.notification,
              members: [document.party[document.party.length - 1].mobile],
              createdAt: new Date(),
            });
          admin
            .messaging()
            .sendToDevice(newPartyUserToken, notification)
            .then(function(response) {
              console.log('Notification sent successfully:', response);
            })
            .catch(function(error) {
              console.log('Notification sent failed:', error);
            });
        }
      } else if (document.party.length < oldDocument.party.length) {
        //When a user is removed from party
        const deletedPartyMember = oldDocument.party.filter(
          ({mobile: id1}) =>
            !document.party.some(({mobile: id2}) => id2 === id1),
        );
        let currentPartiesMobile = document.party.map(p => p.mobile);
        const getCurrentParty = await admin
          .firestore()
          .collection('users')
          .where('mobile', 'in', currentPartiesMobile)
          .get();
        if (!getCurrentParty.empty) {
          const getCurrentPartyToken = getCurrentParty.docs
            .filter(p => p.data().notificationToken)
            .map(party => party.data().notificationToken);
          if (getCurrentPartyToken.length) {
            const partyNotification = {
              notification: {
                title: 'Party Member Removed',
                body: `${
                  deletedPartyMember[0].name
                } has been removed as a Party members for ${
                  document.property.name
                }`,
              },
            };

            await admin
              .firestore()
              .collection('notifications')
              .doc()
              .set({
                notification: partyNotification.notification,
                members: [...currentPartiesMobile],
                createdAt: new Date(),
              });

            admin
              .messaging()
              .sendToDevice(getCurrentPartyToken, partyNotification)
              .then(function(response) {
                console.log('Notification sent successfully:', response);
              })
              .catch(function(error) {
                console.log('Notification sent failed:', error);
              });
          }
        }

        //For removed party member
        const removedPartyUser = await admin
          .firestore()
          .collection('users')
          .where('mobile', '==', deletedPartyMember[0].mobile)
          .get();
        const removedPartyUserToken = !removedPartyUser.empty
          ? removedPartyUser.docs[0].data().notificationToken
          : null;

        if (removedPartyUserToken) {
          const notification = {
            notification: {
              title: 'Party Member Removed',
              body: `You have been removed from ${document.property.name}`,
            },
          };
          await admin
            .firestore()
            .collection('notifications')
            .doc()
            .set({
              notification: notification.notification,
              members: [deletedPartyMember[0].mobile],
              createdAt: new Date(),
            });

          admin
            .messaging()
            .sendToDevice(removedPartyUserToken, notification)
            .then(function(response) {
              console.log('Notification sent successfully:', response);
            })
            .catch(function(error) {
              console.log('Notification sent failed:', error);
            });
        }
      }
      //End party member

      //For new agreement
      if (
        (!oldDocument.agreement && document.agreement) ||
        (oldDocument.agreement &&
          oldDocument.agreement.length !== document.agreement.length)
      ) {
        const getPropertyUsers = await admin
          .firestore()
          .collection('users')
          .where('mobile', 'in', document.partyMobileArray)
          .get();

        if (!getPropertyUsers.empty) {
          const getPropertyUsersToken = getPropertyUsers.docs
            .filter(p => p.data().notificationToken)
            .map(party => party.data().notificationToken);
          if (getPropertyUsersToken.length) {
            const partyNotification = {
              notification: {
                title: 'Agreement Added',
                body: `New Agreement has been added for ${
                  document.property.name
                }`,
              },
            };
            await admin
              .firestore()
              .collection('notifications')
              .doc()
              .set({
                notification: partyNotification.notification,
                members: [...document.partyMobileArray],
                createdAt: new Date(),
              });
            admin
              .messaging()
              .sendToDevice(getPropertyUsersToken, partyNotification)
              .then(function(response) {
                console.log('Notification sent successfully:', response);
              })
              .catch(function(error) {
                console.log('Notification sent failed:', error);
              });
          }
        }
        const currentAgreementIndex = document.agreement.findIndex(
          a => a.currentAgreement,
        );
        const localPDFFile = path.join(os.tmpdir(), 'localPDFFile.pdf');

        pdf
          .create(agreementTemplate(document), {
            timeout: '600000',
            header: {height: '15mm'},
            footer: {height: '15mm'},
          })
          .toFile(localPDFFile, async (err, res) => {
            if (err) {
              return console.log('error', err);
            }
            let uploadBucket = await bucket.upload(localPDFFile, {
              metadata: {contentType: 'application/pdf'},
              destination: `agreement/${
                document.assetID
              }${currentAgreementIndex}.pdf`,
            });
          });
      }
      //End - new agreement

      //Cancelled agreement
      if (
        oldDocument.agreement &&
        oldDocument.agreement.length === document.agreement.length
      ) {
        const length = document.agreement.length;
        const canceledAgreement = !document.agreement[length - 1]
          .currentAgreement;

        if (canceledAgreement) {
          const getPropertyUsers = await admin
            .firestore()
            .collection('users')
            .where('mobile', 'in', document.partyMobileArray)
            .get();

          if (!getPropertyUsers.empty) {
            const getPropertyUsersToken = getPropertyUsers.docs
              .filter(p => p.data().notificationToken)
              .map(party => party.data().notificationToken);
            if (getPropertyUsersToken.length) {
              const partyNotification = {
                notification: {
                  title: 'Cancelled Agreement',
                  body: `Current Agreement has been cancelled for ${
                    document.property.name
                  }. Add a new agreement`,
                },
              };
              await admin
                .firestore()
                .collection('notifications')
                .doc()
                .set({
                  notification: partyNotification.notification,
                  members: [...document.partyMobileArray],
                  createdAt: new Date(),
                });
              admin
                .messaging()
                .sendToDevice(getPropertyUsersToken, partyNotification)
                .then(function(response) {
                  console.log('Notification sent successfully:', response);
                })
                .catch(function(error) {
                  console.log('Notification sent failed:', error);
                });
            }
          }
        }
      }
      //End - cancelled agreement
    } else {
      const user = await admin
        .firestore()
        .collection('users')
        .where('mobile', '==', document.party[0].mobile)
        .get();
      const notificationToken = !user.empty
        ? user.docs[0].data().notificationToken
        : null;
      const payload = {
        notification: {
          title: 'New Property',
          body: `You have added a new property as ${document.party[0].role}`,
        },
      };
      if (notificationToken) {
        await admin
          .firestore()
          .collection('notifications')
          .doc()
          .set({
            notification: payload.notification,
            members: [document.party[0].mobile],
            createdAt: new Date(),
          });
        admin
          .messaging()
          .sendToDevice(notificationToken, payload)
          .then(function(response) {
            console.log('Notification sent successfully:', response);
          })
          .catch(function(error) {
            console.log('Notification sent failed:', error);
          });
      }
    }
    return 0;
  });
