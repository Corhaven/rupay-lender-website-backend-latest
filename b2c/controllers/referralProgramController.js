const ReferralProgram = require('../model/referralProgramModel');

const referralProgramRegister = async (req, res) => {
  try {
    const { fullName, mobile, category, role, agreedToTerms } = req.body;

    if (!fullName || !mobile || !category || agreedToTerms === undefined) {
      return res.status(400).json({ success: false, message: 'fullName, mobile, category, and agreedToTerms are required.' });
    }

    if (!/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ success: false, message: 'Mobile number must be exactly 10 digits.' });
    }

    if (!agreedToTerms) {
      return res.status(400).json({ success: false, message: 'You must agree to the Terms & Conditions.' });
    }

    const existing = await ReferralProgram.findOne({ mobile });
    if (existing) {
      return res.status(409).json({ success: false, message: 'This mobile number is already registered in the referral program.' });
    }

    const entry = await new ReferralProgram({ fullName, mobile, category, role: role || null, agreedToTerms }).save();

    res.status(201).json({ success: true, message: 'Registered successfully. Your QR code will be sent on WhatsApp.', data: entry });
  } catch (error) {
    console.error('referralProgramRegister error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

const getReferralProgramEntries = async (req, res) => {
  try {
    const entries = await ReferralProgram.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: entries });
  } catch (error) {
    console.error('getReferralProgramEntries error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = { referralProgramRegister, getReferralProgramEntries };
