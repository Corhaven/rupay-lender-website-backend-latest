const leadSubject = 'New lead Submission'

const leadHtmlMessage =  async(applicationID,customerName,subAdminName,type)=>{ 

    return (`<p>Dear Admin,</p>
           <p>A new lead has been submitted on the Rupay Lender platform. Below are the details of the submission:</p>
           <p><strong>lead Submission Details:</strong></p>
           <ul>
               <li><strong>application ID:</strong> ${applicationID}</li>
               <li><strong>Customer Name:</strong> ${customerName}</li>
               <li><strong>Product:</strong> ${type}</li>
               <li><strong>Manager:</strong> ${subAdminName}</li>
           </ul>`)}
const leadTextMessage = async(applicationID,customerName,subAdminName,type)=>{ 
   return (`Dear Admin,

A new lead has been submitted on the Rupay Lender platform. Below are the details of the submission:

lead Submission Details:
- application ID: ${applicationID}
- Customer Name: ${customerName}
- Product: ${type}
- Manager:${subAdminName}
`)}

const b2cLeadHtmlMessage =  async(applicationID,customerName,type)=>{ 

    return (`<p>Dear Admin,</p>
           <p>A new B2C lead has been submitted on the Rupay Lender platform. Below are the details of the submission:</p>
           <p><strong>lead Submission Details:</strong></p>
           <ul>
               <li><strong>application ID:</strong> ${applicationID}</li>
               <li><strong>Customer Name:</strong> ${customerName}</li>
               <li><strong>Product:</strong> ${type}</li>
           </ul>`)}
           
const b2cLeadTextMessage = async(applicationID,customerName,type)=>{ 
   return (`Dear Admin,

A new B2C lead has been submitted on the Rupay Lender platform. Below are the details of the submission:

lead Submission Details:
- application ID: ${applicationID}
- Customer Name: ${customerName}
- Product: ${type}

`)}

const movedleadHtmlMessage =  async(applicationID,customerName,type,movedBy)=>{ 

    return (`<p>Dear Manager,</p>
           <p>A new lead has been moved on your panel. Below are the details of the submission:</p>
           <p><strong>lead Submission Details:</strong></p>
           <ul>
               <li><strong>application ID:</strong> ${applicationID}</li>
               <li><strong>Customer Name:</strong> ${customerName}</li>
               <li><strong>Product:</strong> ${type}</li>
               <li><strong>Moved By:</strong> ${movedBy}</li>
           </ul>`)}
           

const movedleadTextMessage = async(applicationID,customerName,type,movedBy)=>{ 

   return (`Dear manager,

A new lead has been moved on your panel. Below are the details of the submission:

lead Submission Details:
- application ID: ${applicationID}
- Customer Name: ${customerName}
- Product:${type}
- Moved By:${movedBy}
`)}
 const movedleadSubject = 'New lead Moved'
const subsCribeSubject = 'The Best Updates Are Coming Your Way!'


const subscribeHTMLMessage =  async()=>{ 

    return (`<p>Dear Sir/Mam,</p>
           <p>Thanks for subscribing! You’re now part of our inner circle.</p>
           <p>Expect valuable tips, updates, and exclusive offers – straight to your inbox.
Stay tuned and feel free to explore more at <strong>https://www.linkedin.com/build-relation/newsletter-follow?entityUrn=7334943030350630913</strong></p>
</ br>
</ br>
      <p>Warm regards,</p>
         
          `)}
           

const subscribeMessage = async()=>{ 

   return (`Dear Sir/Mam,

Thanks for subscribing! You’re now part of our inner circle.
Expect valuable tips, updates, and exclusive offers – straight to your inbox.
Stay tuned and feel free to explore more at https://www.linkedin.com/build-relation/newsletter-follow?entityUrn=7334943030350630913
Warm regards,
`)}
 



module.exports = {subsCribeSubject,subscribeHTMLMessage,subscribeMessage,b2cLeadTextMessage,b2cLeadHtmlMessage,leadTextMessage,leadHtmlMessage,leadSubject,movedleadSubject,movedleadTextMessage,movedleadHtmlMessage}