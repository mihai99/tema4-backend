require("dotenv").config();

const {
  delay,
  ServiceBusClient,
  ServiceBusMessage,
} = require("@azure/service-bus");

const { getEmails } = require("./db");

// connection string to your Service Bus namespace
// const connectionString = process.env.PS_CONNECTION;
console.log(process.env.PS_ENDPOINT);
const connectionString = process.env.PS_ENDPOINT;

// name of the queue
const queueName = "boardSubscriptions";

async function main() {
  const sbClient = new ServiceBusClient(connectionString);

  const receiver = sbClient.createReceiver(queueName);

  // function to handle messages
  const myMessageHandler = async (messageReceived) => {
    console.log(`Received message: ${messageReceived.body}`);
    getEmails(messageReceived.body);
  };

  // function to handle any errors
  const myErrorHandler = async (error) => {
    console.log(error);
  };

  // subscribe and specify the message and error handlers
  receiver.subscribe({
    processMessage: myMessageHandler,
    processError: myErrorHandler,
  });
}
// call the main function
main().catch((err) => {
  console.log("Error occurred: ", err);
  process.exit(1);
});
