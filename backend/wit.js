
import axios from 'axios';

// const message = "urgent text sir bilal for task assignment till 5pm ";
// import axios from 'axios';


const testMessage = "I have a meeting at 4pm tomorrow, medium priority";

const runWitTest = async (message) => {
  try {
    const url = `https://api.wit.ai/message?v=20230804&q=${encodeURIComponent(message)}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: WIT_TOKEN,
        'Content-Type': 'application/json',
      }
    });

    const data = response.data;

    console.log("✅ Raw Response:", JSON.stringify(data, null, 2));

    const { intents, entities } = data;

    const intent = intents?.[0]?.name || "No intent detected";
    const datetime = entities["wit$datetime:datetime"]?.[0]?.value || "No datetime";
    const priority = entities["priority:priority"]?.[0]?.value || "low";

    console.log("\n--- Extracted ---");
    console.log("Intent:", intent);
    console.log("Title:", message);
    console.log("Due Date:", datetime);
    console.log("Priority:", priority);
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
  }
};

runWitTest(testMessage);
