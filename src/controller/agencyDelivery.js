import { Delivery } from "../models";
import { transporter } from "../utils";
export const deliveryData = async (req, res) => {
  try {
    const formData = req.body;
    const imagePath = req.file ? req.file.path : null;
    if (imagePath == null) {
      console.log("no image");
      return res.status(401).json({
        message: "please provide image",
      });
    }
    // Save form data to MongoDB
    const delivery = new Delivery({
      ...formData,
      image: imagePath,
    });
    const saveDelivery = await delivery.save();
    if (!saveDelivery) {
      return res.status(401).json({
        message: "Failed to save delivery",
      });
    }
    const fileName = req.file.filename;
    const recipients = [saveDelivery.customer_email, 'polystarnanotech@gmail.com'];
    const mailOptions = {
      from: "polystarnanotech@gmail.com",
      to: recipients,
      subject: "Moving meastros: New Delivery",
      html: `
      <p>Sender Name: ${saveDelivery.sender_name}</p>
      <p>Sender Contact: ${saveDelivery.sender_contact}</p>
      <p>Transporter Name: ${saveDelivery.transporter_name}</p>
      <p>Transporter Contact: ${saveDelivery.transporter_contact}</p>
      <p>Product Description: ${saveDelivery.product_description}</p>
      <p>Customer Name: ${saveDelivery.customer_name}</p>
      <p>Customer Contact: ${saveDelivery.customer_contact}</p>
      <p>Delivery Address: ${saveDelivery.delivery_address}</p>
      <p>Customer Email: ${saveDelivery.customer_email}</p>
      <p>Delivery Date: ${saveDelivery.delivery_date}</p>
      <p>Product image: </p>
      <img src="cid:unique-image-id" style="width: 400px; height:300px; "  alt="Product Image">
      `,
      attachments: [
        {
          filename: fileName,
          path: req.file.path,
          cid: "unique-image-id",
        },
      ],
    };
    console.log(mailOptions);
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.json({ success: false });
      }
      console.log("Email sent: " + info);
      return res.status(201).json({
        message: "Delivery request sent successfully",
        success: true,
        data: saveDelivery,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
