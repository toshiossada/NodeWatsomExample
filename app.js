const AssistantV2 = require("ibm-watson/assistant/v2");
const prompt = require("prompt-sync")();
const { IamAuthenticator } = require("ibm-watson/auth");

const ASSISTANT_IAM_URL = "https://gateway.watsonplatform.net/assistant/api";
const ASSISTANT_IAM_APIKEY = "opmb0YP1sZAUY0Sy-NcRC83Ko8IsdpYRv9KR1cGKOSiQ";
const ASSISTANT_ID = "42f83a8d-0bac-41fd-9b88-7c81ff5e9da3";
let SESSION_ID = "1f25f55a-3fe7-4a0f-b52f-fa24293f76af";
let finish = false;

const service = new AssistantV2({
  version: "2019-02-28",
  authenticator: new IamAuthenticator({
    apikey: ASSISTANT_IAM_APIKEY
  }),
  url: ASSISTANT_IAM_URL
});

service
  .createSession({
    assistantId: ASSISTANT_ID
  })
  .then(res => {
    SESSION_ID = res.result.session_id;
    sendMessage(null);
  })
  .catch(err => {
    console.log(err);
  });

function sendMessage(msg) {
  service
    .message({
      assistantId: ASSISTANT_ID,
      sessionId: SESSION_ID,
      input: {
        message_type: "text",
        text: msg
      }
    })
    .then(res => {
      const msgs = res.result.output.generic;
      msgs.forEach(element => {
        console.log(element.text);
      });

      if (
        res.result.output.intents.length > 0 &&
        res.result.output.intents[0].intent === "despedida"
      ) {
        finish = true;
      }
      if (!finish) {
        const inputMsg = prompt(">>");
        sendMessage(inputMsg);
      } else {
        deletarSessao();
      }
    })
    .catch(err => {
      console.log(err);
    });
}

function deletarSessao() {
  service
    .deleteSession({
      assistantId: ASSISTANT_ID,
      sessionId: SESSION_ID
    })
    .then(res => {

    })
    .catch(err => {
      console.log(err);
    });
}
