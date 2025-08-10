import axios from "axios";
import { DateTime } from "luxon";

const WIT_TOKEN = "Bearer 72HIVMNTYWLQBNYTKOULYUBXDKTGUIOX"; // replace with your actual token

export const runWitTest = async (message) => {
  try {
    const url = `https://api.wit.ai/message?v=20230804&q=${encodeURIComponent(message)}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: WIT_TOKEN,
        "Content-Type": "application/json",
      },
    });
    console.log("Wit AI Response from wit js:", response.data);
    const { intents, entities } = response.data;

    const intent = intents?.[0]?.name || "No intent detected";

    let datetime = "No datetime";
    const datetimeEntity = entities["wit$datetime:datetime"]?.[0];
    if (datetimeEntity) {
      let isoDate = null;
      if (datetimeEntity.type === "value") {
        isoDate = datetimeEntity.value;
      } else if (datetimeEntity.type === "interval") {
        isoDate = datetimeEntity.to?.value || datetimeEntity.from?.value || null;
      }

      if (isoDate) {
        datetime = DateTime.fromISO(isoDate, { setZone: true })
          .toFormat("MMMM dd, yyyy 'at' h:mm a ZZZZ"); 
      }
    }

    const priority = entities["priority:priority"]?.[0]?.value || "low";

    return { text: message, intent, datetime, priority };
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
    return { text: message, intent: "Error", datetime: "Error", priority: "Error" };
  }
};
