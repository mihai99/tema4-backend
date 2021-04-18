const { ServiceBusClient } = require("@azure/service-bus");

// connection string to your Service Bus namespace
// const connectionString = process.env.PS_CONNECTION;
const connectionString =
  "Endpoint=sb://homework4.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=+Dsm5AQz+3mOaIK0v4j76O5dcxx4sJ6VYYDQVW0cR0k=";

console.log(connectionString);
// name of the queue
const queueName = "boardSubscriptions";

const sendMessage = async (message) => {
  // create a Service Bus client using the connection string to the Service Bus namespace
  const sbClient = new ServiceBusClient(connectionString);

  // createSender() can also be used to create a sender for a topic.
  const sender = sbClient.createSender(queueName);
  let messageBus = { body: message.toString() };
  try {
    let batch = await sender.createMessageBatch();
    if (!batch.tryAddMessage(messageBus)) {
      await sender.sendMessages(batch);
      batch = await sender.createMessageBatch();

      if (!batch.tryAddMessage(messageBus)) {
        throw new Error("Message too big to fit in a batch");
      }
    }
    await sender.sendMessages(batch);
    console.log(`Sent a batch of messages to the queue: ${queueName}`);

    // Close the sender
    await sender.close();
  } finally {
    await sbClient.close();
  }
};

module.exports = { sendMessage };
