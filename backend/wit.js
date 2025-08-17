import axios from "axios";
import { DateTime } from "luxon";

const WIT_TOKEN = "Bearer 72HIVMNTYWLQBNYTKOULYUBXDKTGUIOX";

export const runWitTest = async (message) => {
  try {
    const url = `https://api.wit.ai/message?v=20230804&q=${encodeURIComponent(message)}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: WIT_TOKEN,
        "Content-Type": "application/json",
      },
    });
    
    console.log("🤖 Wit AI Response:", response.data);
    const { intents, entities } = response.data;

    const intent = intents?.[0]?.name || "No intent detected";

    let datetime = null;
    let datetimeFormatted = "No datetime";
    const datetimeEntity = entities["wit$datetime:datetime"]?.[0];
    
    if (datetimeEntity) {
      let isoDate = null;
      
      console.log("📅 DateTime entity:", datetimeEntity);
      
      if (datetimeEntity.type === "value") {
        isoDate = datetimeEntity.value;
        console.log("📅 Single value:", isoDate);
      } else if (datetimeEntity.type === "interval") {
        // For intervals, use FROM value (start time) instead of TO (end time)
        isoDate = datetimeEntity.from?.value || datetimeEntity.to?.value;
        console.log("📅 Interval - From:", datetimeEntity.from?.value);
        console.log("📅 Interval - To:", datetimeEntity.to?.value);
        console.log("📅 Using:", isoDate);
      }

      if (isoDate) {
        datetime = isoDate;
        datetimeFormatted = DateTime.fromISO(isoDate, { setZone: true })
          .toFormat("MMMM dd, yyyy 'at' h:mm a ZZZZ");
      }
    }

    const priority = entities["priority:priority"]?.[0]?.value || "Medium";

    const result = { 
      text: message, 
      intent, 
      datetime,
      datetimeFormatted,
      priority 
    };
    
    console.log("🎯 Final Wit result:", result);
    return result;
    
  } catch (error) {
    console.error("❌ Wit.ai Error:", error.response?.data || error.message);
    return { text: message, intent: "Error", datetime: null, priority:"medium" };
  }
};