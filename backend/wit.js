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
    
    console.log("Wit AI Response from wit js:", response.data);
    const { intents, entities } = response.data;

    const intent = intents?.[0]?.name || "No intent detected";

    let datetime = null;
    let datetimeFormatted = "No datetime";
    const datetimeEntity = entities["wit$datetime:datetime"]?.[0];
    
    if (datetimeEntity) {
      let isoDate = null;
      
      if (datetimeEntity.type === "value") {
        // Single point in time
        isoDate = datetimeEntity.value;
      } else if (datetimeEntity.type === "interval") {
        // For intervals like "tonight", use the FROM value (start of period)
        // This gives us 6 PM instead of midnight
        isoDate = datetimeEntity.from?.value || datetimeEntity.to?.value || null;
        
        console.log("📅 Interval detected:");
        console.log("  From:", datetimeEntity.from?.value);
        console.log("  To:", datetimeEntity.to?.value);
        console.log("  Using:", isoDate);
      }

      if (isoDate) {
        datetime = isoDate;
        datetimeFormatted = DateTime.fromISO(isoDate, { setZone: true })
          .toFormat("MMMM dd, yyyy 'at' h:mm a ZZZZ");
      }
    }

    const priority = entities["priority:priority"]?.[0]?.value || "Medium";

    console.log("📋 Parsed result:", {
      text: message,
      intent,
      datetime,
      datetimeFormatted,
      priority
    });

    return { 
      text: message, 
      intent, 
      datetime,
      datetimeFormatted,
      priority 
    };
  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
    return { text: message, intent: "Error", datetime: null, priority: "Error" };
  }
};