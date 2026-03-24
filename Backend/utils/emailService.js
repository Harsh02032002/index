const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html,
    });
    console.log('📧 Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Email error:', error);
    throw error;
  }
};

const sendRiskDueDateNotification = async (risk, ownerEmail) => {
  const subject = `Risk Due Date Reminder: ${risk.title}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">⚠️ Risk Due Date Reminder</h1>
        <p style="margin: 5px 0 0 0;">ezRisk Management Platform</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
        <h2 style="color: #dc3545; margin-bottom: 20px;">📅 Risk Action Required</h2>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #dc3545; margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; color: #333;">${risk.title}</h3>
          <p style="margin: 5px 0; color: #666;"><strong>Risk ID:</strong> ${risk.riskId}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Category:</strong> ${risk.category}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Department:</strong> ${risk.department}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Risk Score:</strong> ${risk.riskScore}</p>
          <p style="margin: 10px 0; color: #666;">${risk.description}</p>
        </div>
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px 0; color: #856404;">📋 Due Date Information</h4>
          <p style="margin: 5px 0; color: #856404;"><strong>Target Closure Date:</strong> ${risk.targetClosureDate}</p>
          <p style="margin: 5px 0; color: #856404;"><strong>Days Remaining:</strong> ${calculateDaysRemaining(risk.targetClosureDate)} days</p>
        </div>
        
        <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; border-left: 4px solid #17a2b8; margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px 0; color: #0c5460;">👤 Action Required</h4>
          <p style="margin: 5px 0; color: #0c5460;"><strong>Assigned To:</strong> ${risk.owner}</p>
          <p style="margin: 5px 0; color: #0c5460;">Please review this risk and create a treatment plan to mitigate the identified threat.</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="http://localhost:8080/treatments" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
            🚀 Create Treatment Plan
          </a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; text-align: center; color: #6c757d; font-size: 12px;">
          <p>This is an automated message from ezRisk Platform</p>
          <p>Please do not reply to this email</p>
        </div>
      </div>
    </div>
  `;
  
  return await sendEmail(ownerEmail, subject, html);
};

const sendTreatmentReminder = async (treatment, risk, ownerEmail) => {
  const subject = `Treatment Action Required: ${treatment.treatmentId}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">🔧 Treatment Action Required</h1>
        <p style="margin: 5px 0 0 0;">ezRisk Management Platform</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
        <h2 style="color: #28a745; margin-bottom: 20px;">📋 Treatment Implementation</h2>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; color: #333;">${treatment.treatmentId} - ${treatment.type}</h3>
          <p style="margin: 5px 0; color: #666;"><strong>Linked Risk:</strong> ${risk.title}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Status:</strong> ${treatment.status}</p>
          <p style="margin: 10px 0; color: #666;">${treatment.plan}</p>
        </div>
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px 0; color: #856404;">📅 Timeline</h4>
          <p style="margin: 5px 0; color: #856404;"><strong>Start Date:</strong> ${treatment.startDate || 'Not set'}</p>
          <p style="margin: 5px 0; color: #856404;"><strong>Due Date:</strong> ${treatment.dueDate}</p>
          <p style="margin: 5px 0; color: #856404;"><strong>Days Remaining:</strong> ${calculateDaysRemaining(treatment.dueDate)} days</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="http://localhost:8080/treatments" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
            📝 Update Treatment Status
          </a>
        </div>
      </div>
    </div>
  `;
  
  return await sendEmail(ownerEmail, subject, html);
};

const sendRiskReviewNotification = async (risk, reviewerEmail, reviewComments) => {
  const subject = `Risk Review Completed: ${risk.title}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #17a2b8 0%, #6f42c1 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">📊 Risk Review Completed</h1>
        <p style="margin: 5px 0 0 0;">ezRisk Management Platform</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
        <h2 style="color: #17a2b8; margin-bottom: 20px;">✅ Review Summary</h2>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #17a2b8; margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; color: #333;">${risk.title}</h3>
          <p style="margin: 5px 0; color: #666;"><strong>Risk ID:</strong> ${risk.riskId}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Current Status:</strong> ${risk.status}</p>
          <p style="margin: 5px 0; color: #666;"><strong>Risk Score:</strong> ${risk.riskScore}</p>
        </div>
        
        <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; border-left: 4px solid #17a2b8; margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px 0; color: #0c5460;">💬 Review Comments</h4>
          <p style="margin: 5px 0; color: #0c5460;">${reviewComments}</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="http://localhost:8080/risks" style="background: linear-gradient(135deg, #17a2b8 0%, #6f42c1 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
            📈 View Risk Details
          </a>
        </div>
      </div>
    </div>
  `;
  
  return await sendEmail(reviewerEmail, subject, html);
};

const calculateDaysRemaining = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

module.exports = {
  sendEmail,
  sendRiskDueDateNotification,
  sendTreatmentReminder,
  sendRiskReviewNotification,
  calculateDaysRemaining
};
