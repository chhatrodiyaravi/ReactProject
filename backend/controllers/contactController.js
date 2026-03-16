import Contact from "../models/Contact.js";

// @desc    Create a new contact message
// @route   POST /api/contact
// @access  Public
export const createContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required fields (name, email, subject, message)",
      });
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Validate message length
    if (message.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Message must be at least 10 characters long",
      });
    }

    // Create contact
    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : null,
      subject: subject.trim(),
      message: message.trim(),
    });

    console.log("Contact message created:", contact._id);

    res.status(201).json({
      success: true,
      message: "Thank you for contacting us! We'll respond soon.",
      data: contact,
    });
  } catch (error) {
    console.error("Contact creation error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to submit contact form",
    });
  }
};

// @desc    Get all contact messages (Admin only)
// @route   GET /api/contact
// @access  Private/Admin
export const getAllContacts = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;

    // Build filter
    const filter = {};
    if (status) {
      filter.status = status;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Contact.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: contacts,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Get contacts error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch contacts",
    });
  }
};

// @desc    Get a single contact by ID
// @route   GET /api/contact/:id
// @access  Private/Admin
export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id).populate(
      "repliedBy",
      "name email",
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error("Get contact error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch contact",
    });
  }
};

// @desc    Reply to a contact message
// @route   PUT /api/contact/:id/reply
// @access  Private/Admin
export const replyToContact = async (req, res) => {
  try {
    const { reply } = req.body;

    if (!reply || reply.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a reply message",
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        status: "replied",
        reply: reply.trim(),
        repliedAt: new Date(),
        repliedBy: req.user?.id || null,
      },
      { new: true },
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    console.log("Contact replied to:", contact._id);

    res.status(200).json({
      success: true,
      message: "Reply sent successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Reply to contact error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to reply to contact",
    });
  }
};

// @desc    Update contact status (Admin only)
// @route   PUT /api/contact/:id/status
// @access  Private/Admin
export const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !["new", "replied", "resolved"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid status (new, replied, resolved)",
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: contact,
    });
  } catch (error) {
    console.error("Update contact status error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update contact status",
    });
  }
};

// @desc    Delete a contact
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    console.log("Contact deleted:", contact._id);

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.error("Delete contact error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete contact",
    });
  }
};
