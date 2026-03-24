const cron = require('node-cron');
const Risk = require('../models/Risk');
const Treatment = require('../models/Treatment');
const { sendRiskDueDateNotification, sendTreatmentReminder } = require('./emailService');

// Schedule to run every day at 9:00 AM
cron.schedule('0 9 * * *', async () => {
  console.log('🕘 Running daily due date check...');
  await checkDueDates();
});

// Schedule to run every day at 8:00 AM
cron.schedule('0 8 * * *', async () => {
  console.log('🕗 Running daily treatment reminder check...');
  await checkTreatmentDueDates();
});

const checkDueDates = async () => {
  try {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    // Check risks due tomorrow
    const risksDueTomorrow = await Risk.find({
      targetClosureDate: {
        $gte: tomorrow.toISOString().split('T')[0],
        $lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      status: { $in: ['Open', 'In Progress'] }
    });

    // Check risks due next week
    const risksDueNextWeek = await Risk.find({
      targetClosureDate: {
        $gte: today.toISOString().split('T')[0],
        $lte: nextWeek.toISOString().split('T')[0]
      },
      status: { $in: ['Open', 'In Progress'] }
    });

    // Send notifications for risks due tomorrow
    for (const risk of risksDueTomorrow) {
      try {
        // Mock email - in real scenario, get owner email from user database
        const ownerEmail = `${risk.owner.toLowerCase().replace(/\s+/g, '.')}@company.com`;
        await sendRiskDueDateNotification(risk, ownerEmail);
        console.log(`📧 Sent due date reminder for risk: ${risk.riskId}`);
      } catch (error) {
        console.error(`❌ Failed to send email for risk ${risk.riskId}:`, error);
      }
    }

    // Send weekly summary for risks due next week
    for (const risk of risksDueNextWeek) {
      try {
        const ownerEmail = `${risk.owner.toLowerCase().replace(/\s+/g, '.')}@company.com`;
        await sendRiskDueDateNotification(risk, ownerEmail);
        console.log(`📧 Sent weekly reminder for risk: ${risk.riskId}`);
      } catch (error) {
        console.error(`❌ Failed to send weekly email for risk ${risk.riskId}:`, error);
      }
    }

    console.log(`✅ Due date check completed. Processed ${risksDueTomorrow.length + risksDueNextWeek.length} risks.`);
  } catch (error) {
    console.error('❌ Error in due date check:', error);
  }
};

const checkTreatmentDueDates = async () => {
  try {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const treatmentsDueTomorrow = await Treatment.find({
      dueDate: today.toISOString().split('T')[0],
      status: { $in: ['Planned', 'In Progress'] }
    }).populate('linkedRiskId');

    for (const treatment of treatmentsDueTomorrow) {
      try {
        const ownerEmail = `${treatment.owner.toLowerCase().replace(/\s+/g, '.')}@company.com`;
        await sendTreatmentReminder(treatment, treatment.linkedRiskId, ownerEmail);
        console.log(`📧 Sent treatment reminder for: ${treatment.treatmentId}`);
      } catch (error) {
        console.error(`❌ Failed to send treatment reminder for ${treatment.treatmentId}:`, error);
      }
    }

    console.log(`✅ Treatment due date check completed. Processed ${treatmentsDueTomorrow.length} treatments.`);
  } catch (error) {
    console.error('❌ Error in treatment due date check:', error);
  }
};

// Manual trigger for testing
const triggerDueDateCheck = async () => {
  console.log('🔔 Manually triggering due date check...');
  await checkDueDates();
  await checkTreatmentDueDates();
};

module.exports = {
  checkDueDates,
  checkTreatmentDueDates,
  triggerDueDateCheck
};
