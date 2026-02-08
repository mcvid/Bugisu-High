import{s as r}from"./index-DqW8wV2_.js";const a=async({to:s,subject:i,html:t})=>{try{const{data:e,error:o}=await r.functions.invoke("send-email",{body:{to:s,subject:i,html:t}});if(o)throw console.error("Supabase function error:",o),o;return console.log("✅ Email sent successfully:",e),{success:!0,data:e}}catch(e){return console.error("❌ Email sending failed:",e),{success:!1,error:e.message}}},c=async s=>{const{parent_name:i,parent_email:t,student_name:e,class_applying_for:o}=s,n=`
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
        .key-box { background: #fff7ed; border: 2px solid #f97316; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
        .key { font-size: 24px; font-weight: bold; color: #f97316; letter-spacing: 2px; }
        .features { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .feature-item { margin: 10px 0; }
        .footer { text-align:center; padding: 20px; color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0;">Welcome to Bugisu High School!</h1>
        </div>
        <div class="content">
            <p>Dear ${i},</p>
            
            <p><strong>Congratulations!</strong> We are delighted to inform you that <strong>${e}'s</strong> application to Bugisu High School has been <span style="color: #22c55e; font-weight: bold;">APPROVED</span> for ${o}.</p>
            
            <p>To help you stay connected with ${e}'s academic journey, we've created an exclusive Parent Portal:</p>
            
            <div class="key-box">
                <p style="margin: 0 0 10px; font-weight: bold;">🔐 YOUR ACCESS KEY</p>
                <div class="key">BugisuLions2026</div>
                <p style="margin: 10px 0 0; font-size: 14px; color: #6b7280;">Keep this key secure for the 2026 school year</p>
            </div>
            
            <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; font-weight: bold;">📍 How to Access:</p>
                <ol style="margin: 10px 0 0; padding-left: 20px;">
                    <li>Visit: <a href="https://www.bugisuhighschool.com" style="color: #3b82f6;">www.bugisuhighschool.com</a></li>
                    <li>Click: <strong>Student Life → Parents</strong></li>
                    <li>Enter your community key when prompted</li>
                </ol>
            </div>
            
            <div class="features">
                <p style="margin: 0 0 15px; font-weight: bold;">✨ Portal Features:</p>
                <div class="feature-item">✅ Real-time notifications</div>
                <div class="feature-item">✅ Submit leave/absence requests</div>
                <div class="feature-item">✅ View academic progress reports</div>
                <div class="feature-item">✅ Access school announcements</div>
                <div class="feature-item">✅ View digital student ID card</div>
            </div>
            
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; font-weight: bold;">📋 NEXT STEPS:</p>
                <ol style="margin: 10px 0 0; padding-left: 20px;">
                    <li>Complete the enrollment process at our office</li>
                    <li>Pay the registration fees</li>
                    <li>Attend the orientation session (details to follow)</li>
                </ol>
            </div>
            
            <p>If you have any questions or need assistance accessing the portal, please contact our admissions office or reply to this email.</p>
            
            <p>Once again, congratulations! We look forward to welcoming ${e} to Bugisu High School.</p>
            
            <p style="margin-top: 30px;">Best regards,<br><strong>Bugisu High School</strong><br>Admissions Office</p>
        </div>
        <div class="footer">
            <p>© 2026 Bugisu High School. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `.trim();return await a({to:t,subject:"Welcome to Bugisu High School - Parent Portal Access",html:n})},l=async s=>{const{parent_name:i,parent_email:t,student_name:e}=s,o=`
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
        .key-box { background: #dbeafe; border: 2px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 8px; text-align: center; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2 style="margin: 0;">Parent Portal Access Reminder</h2>
        </div>
        <div class="content">
            <p>Dear ${i||"Parent"},</p>
            
            <p>This is a friendly reminder about our <strong>Parent Portal</strong>, your gateway to staying connected with ${e?e+"'s":"your child's"} academic progress.</p>
            
            <div class="key-box">
                <p style="margin: 0; font-weight: bold;">🔑 Community Key:</p>
                <p style="font-size: 20px; font-weight: bold; color: #3b82f6; margin: 10px 0;">BugisuLions2026</p>
            </div>
            
            <p><strong>Access Information:</strong></p>
            <ul>
                <li>Website: <a href="https://www.bugisuhighschool.com">www.bugisuhighschool.com</a></li>
                <li>Navigate to: Student Life → Parents</li>
                <li>Enter the community key above</li>
            </ul>
            
            <p><strong>Recently Added Features:</strong></p>
            <ul>
                <li>📱 Digital student ID cards</li>
                <li>📝 Online leave request submissions</li>
                <li>🔔 Real-time exam notifications</li>
                <li>📅 Academic calendar sync</li>
            </ul>
            
            <p>Haven't logged in yet? It takes less than a minute!</p>
            
            <p>Questions? Contact us at <a href="mailto:info@bugisuhighschool.com">info@bugisuhighschool.com</a></p>
            
            <p style="margin-top: 30px;">Warm regards,<br><strong>Bugisu High School Administration</strong></p>
        </div>
        <div class="footer">
            <p>© 2026 Bugisu High School. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `.trim();return await a({to:t,subject:"Bugisu HS Parent Portal - Access Reminder",html:o})},p=async s=>{const i=[];for(const t of s){const e=await l(t);i.push(e),await new Promise(o=>setTimeout(o,100))}return{success:!0,totalSent:i.filter(t=>t.success).length,totalFailed:i.filter(t=>!t.success).length,results:i}},g=async s=>{const{parent_name:i,parent_email:t,student_name:e}=s,o=`
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #6b7280; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2 style="margin: 0;">Application Status Update</h2>
        </div>
        <div class="content">
            <p>Dear ${i},</p>
            
            <p>Thank you for your interest in Bugisu High School for ${e}.</p>
            
            <p>After careful review, we regret to inform you that we are unable to offer admission at this time due to limited spaces available.</p>
            
            <p>We encourage you to reapply in the next admission cycle or explore our waiting list option.</p>
            
            <p>If you have any questions, please contact our admissions office.</p>
            
            <p>Thank you for considering Bugisu High School.</p>
            
            <p style="margin-top: 30px;">Best regards,<br><strong>Bugisu High School</strong><br>Admissions Office</p>
        </div>
    </div>
</body>
</html>
    `.trim();return await a({to:t,subject:"Application Status - Bugisu High School",html:o})};export{g as a,p as b,c as s};
