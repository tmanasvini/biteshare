import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const sns = new SNSClient({ region: "us-west-2" });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { volunteers, foodDescription, diningHall, shelter } = req.body;
    
    const message = `🍽️ New delivery opportunity!\n\nFood: ${foodDescription}\nFrom: ${diningHall}\nTo: ${shelter}\n\nReply YES to accept this delivery.`;
    
    const notifications = volunteers.map(volunteer => 
      sns.send(new PublishCommand({
        PhoneNumber: volunteer.phone,
        Message: message
      }))
    );
    
    await Promise.all(notifications);
    res.json({ success: true, notified: volunteers.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}