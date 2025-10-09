// const uploadB2bLeads = require("./multer");

const { uploadB2bLeads } = require("./multervendor")

 const imgObject = uploadB2bLeads.fields([
    { name: 'panCard', maxCount: 1 },
    { name: 'aadharfront', maxCount: 1 },
    { name: 'aadharback', maxCount: 1 },
    { name: 'payslip1', maxCount: 1 },
    { name: 'payslip2', maxCount: 1 },
    { name: 'payslip3', maxCount: 1 },
    { name: 'sevenMonthStatement', maxCount: 1 }, 
    { name: 'form16', maxCount: 1 },
    { name: 'form26', maxCount: 1 },
    { name: 'closerLetter1', maxCount: 1 },
    { name: 'closerLetter2', maxCount: 1 },
    { name: 'closerLetter3', maxCount: 1 }

  ])

  const bankerObject = uploadB2bLeads.fields([
    { name: 'employeCard', maxCount: 1 }
    // { name: 'aadharCard', maxCount: 1 },
  ])
 const cpLoad = uploadB2bLeads.fields([
    { name: 'panCard', maxCount: 1 },
    { name: 'aadharfront', maxCount: 1 },
    { name: 'aadharback', maxCount: 1 },
    { name: 'payslip1', maxCount: 1 },
    { name: 'payslip2', maxCount: 1 },
    { name: 'payslip3', maxCount: 1 },
    { name: 'sevenMonthStatement', maxCount: 1 }
  ])

  const homeImgObjectJob = uploadB2bLeads.fields([
    { name: 'panCard', maxCount: 1 },
    { name: 'aadharfront', maxCount: 1 },
    { name: 'aadharback', maxCount: 1 },
    { name: 'payslip1', maxCount: 1 },
    { name: 'payslip2', maxCount: 1 },
    { name: 'payslip3', maxCount: 1 },
    { name: 'sevenMonthStatement', maxCount: 1 }, 
    { name: 'form16', maxCount: 1 },
    { name: 'form26', maxCount: 1 },
    { name: 'propertyChain', maxCount: 1 },
    { name: 'map', maxCount: 1 }

  ])
  const homeImgObjectBusiness = uploadB2bLeads.fields([
    { name: 'panCard', maxCount: 1 },
    { name: 'aadharfront', maxCount: 1 },
    { name: 'aadharback', maxCount: 1 },
    { name: 'gstMsmeCerificate', maxCount: 1 },
    { name: 'itrComution1', maxCount: 1 },
    { name: 'itrComution2', maxCount: 1 },
    { name: 'itrComution3', maxCount: 1 }, 
    { name: 'oneBankStatementCurrentAccount', maxCount: 1 },
    { name: 'oneYearSavingAccountStatement', maxCount: 1 },
    { name: 'propertyChain', maxCount: 1 },
    { name: 'map', maxCount: 1 }])
    const homebtObject1 = uploadB2bLeads.fields([
        { name: 'panCard', maxCount: 1 },
        { name: 'aadharfront', maxCount: 1 },
        { name: 'aadharback', maxCount: 1 },
        { name: 'payslip1', maxCount: 1 },
        { name: 'payslip2', maxCount: 1 },
        { name: 'payslip3', maxCount: 1 },
        { name: 'sevenMonthStatement', maxCount: 1 }, 
        { name: 'form16', maxCount: 1 },
        { name: 'form26', maxCount: 1 },
        { name: 'propertyChain', maxCount: 1 },
        { name: 'map', maxCount: 1 },
        { name: 'sanctionLetter', maxCount: 1 },
      ],)
    
      const homebtObject2 = uploadB2bLeads.fields([
        { name: 'panCard', maxCount: 1 },
        { name: 'aadharfront', maxCount: 1 },
        { name: 'aadharback', maxCount: 1 },
        { name: 'gstMsmeCerificate', maxCount: 1 },
        { name: 'itrComution1', maxCount: 1 },
        { name: 'itrComution2', maxCount: 1 },
        { name: 'itrComution3', maxCount: 1 }, 
        { name: 'oneBankStatementCurrentAccount', maxCount: 1 },
        { name: 'oneYearSavingAccountStatement', maxCount: 1 },
        { name: 'propertyChain', maxCount: 1 },
        { name: 'map', maxCount: 1 },
        { name: 'sanctionLetter', maxCount: 1 },
      ],)
      const businessimgObject = uploadB2bLeads.fields([
        { name: 'panCard', maxCount: 1 },
        { name: 'aadharfront', maxCount: 1 },
        { name: 'aadharback', maxCount: 1 },
        { name: 'gstMsmeCerificate', maxCount: 1 },
        { name: 'itrComution1', maxCount: 1 },
        { name: 'itrComution2', maxCount: 1 },
        { name: 'itrComution3', maxCount: 1 }, 
        { name: 'oneBankStatementCurrentAccount', maxCount: 1 },
        { name: 'oneYearSavingAccountStatement', maxCount: 1 },  
        ])
        const lapJobObject = uploadB2bLeads.fields([
            { name: 'panCard', maxCount: 1 },
            { name: 'aadharfront', maxCount: 1 },
            { name: 'aadharback', maxCount: 1 },
            { name: 'payslip1', maxCount: 1 },
            { name: 'payslip2', maxCount: 1 },
            { name: 'payslip3', maxCount: 1 },
            { name: 'sevenMonthStatement', maxCount: 1 }, 
            { name: 'form16', maxCount: 1 },
            { name: 'form26', maxCount: 1 },
            { name: 'propertyChain', maxCount: 1 },
            { name: 'map', maxCount: 1 }
        
          ])

          const lapBusiness = uploadB2bLeads.fields([
            { name: 'panCard', maxCount: 1 },
            { name: 'aadharfront', maxCount: 1 },
            { name: 'aadharback', maxCount: 1 },
            { name: 'gstMsmeCerificate', maxCount: 1 },
            { name: 'itrComution1', maxCount: 1 },
            { name: 'itrComution2', maxCount: 1 },
            { name: 'itrComution3', maxCount: 1 }, 
            { name: 'oneBankStatementCurrentAccount', maxCount: 1 },
            { name: 'oneYearSavingAccountStatement', maxCount: 1 },
            { name: 'propertyChain', maxCount: 1 },
            { name: 'map', maxCount: 1 }])
            const lapJobBbtobject = uploadB2bLeads.fields([
                { name: 'panCard', maxCount: 1 },
                { name: 'aadharfront', maxCount: 1 },
                { name: 'aadharback', maxCount: 1 },
                { name: 'payslip1', maxCount: 1 },
                { name: 'payslip2', maxCount: 1 },
                { name: 'payslip3', maxCount: 1 },
                { name: 'sevenMonthStatement', maxCount: 1 }, 
                { name: 'form16', maxCount: 1 },
                { name: 'form26', maxCount: 1 },
                { name: 'propertyChain', maxCount: 1 },
                { name: 'map', maxCount: 1 },
                { name: 'sanctionLetter', maxCount: 1 }
            
              ])
              const lapBtBusiness = uploadB2bLeads.fields([
                { name: 'panCard', maxCount: 1 },
                { name: 'aadharfront', maxCount: 1 },
                { name: 'aadharback', maxCount: 1 },
                { name: 'gstMsmeCerificate', maxCount: 1 },
                { name: 'itrComution1', maxCount: 1 },
                { name: 'itrComution2', maxCount: 1 },
                { name: 'itrComution3', maxCount: 1 }, 
                { name: 'oneBankStatementCurrentAccount', maxCount: 1 },
                { name: 'oneYearSavingAccountStatement', maxCount: 1 },
                { name: 'propertyChain', maxCount: 1 },
                { name: 'map', maxCount: 1 },
                { name: 'sanctionLetter', maxCount: 1 }]) 
             
                const usedCarObjectJob = uploadB2bLeads.fields([
                    { name: 'panCard', maxCount: 1 },
                    { name: 'aadharfront', maxCount: 1 },
                    { name: 'aadharback', maxCount: 1 },
                    { name: 'payslip1', maxCount: 1 },
                    { name: 'payslip2', maxCount: 1 },
                    { name: 'payslip3', maxCount: 1 },
                    { name: 'sevenMonthStatement', maxCount: 1 }, 
                
                    { name: 'insurancePolicy', maxCount: 1 },
                    { name: 'rc', maxCount: 1 },
                    // { name: 'sanctionLetter', maxCount: 1 },
                
                
                  ])
                  const usedCarObjectBusiness = uploadB2bLeads.fields([
                    { name: 'panCard', maxCount: 1 },
                    { name: 'aadharfront', maxCount: 1 },
                    { name: 'aadharback', maxCount: 1 },
                    { name: 'gstMsmeCerificate', maxCount: 1 },
                    { name: 'itrComution1', maxCount: 1 },
                    { name: 'itrComution2', maxCount: 1 },
                    { name: 'itrComution3', maxCount: 1 }, 
                    { name: 'oneBankStatementCurrentAccount', maxCount: 1 },
                    { name: 'oneYearSavingAccountStatement', maxCount: 1 },
                    { name: 'insurancePolicy', maxCount: 1 },
                    { name: 'rc', maxCount: 1 },
                    
                    // { name: 'sanctionLetter', maxCount: 1 },
                ])
                const usedCarBtJobObject = uploadB2bLeads.fields([
                    { name: 'panCard', maxCount: 1 },
                    { name: 'aadharfront', maxCount: 1 },
                    { name: 'aadharback', maxCount: 1 },
                    { name: 'payslip1', maxCount: 1 },
                    { name: 'payslip2', maxCount: 1 },
                    { name: 'payslip3', maxCount: 1 },
                    { name: 'sevenMonthStatement', maxCount: 1 }, 
                  
                    { name: 'insurancePolicy', maxCount: 1 },
                    { name: 'rc', maxCount: 1 },
                    { name: 'sanctionLetter', maxCount: 1 },
                
                
                  ])
                  const usedCarbtBusiness = uploadB2bLeads.fields([
                    { name: 'panCard', maxCount: 1 },
                    { name: 'aadharfront', maxCount: 1 },
                    { name: 'aadharback', maxCount: 1 },
                    { name: 'gstMsmeCerificate', maxCount: 1 },
                    { name: 'itrComution1', maxCount: 1 },
                    { name: 'itrComution2', maxCount: 1 },
                    { name: 'itrComution3', maxCount: 1 }, 
                    { name: 'oneBankStatementCurrentAccount', maxCount: 1 },
                    { name: 'oneYearSavingAccountStatement', maxCount: 1 },
                    { name: 'insurancePolicy', maxCount: 1 },
                    { name: 'rc', maxCount: 1 },
                    
                    { name: 'sanctionLetter', maxCount: 1 },
                ])
  module.exports = {bankerObject,usedCarBtJobObject,usedCarbtBusiness,usedCarObjectJob, usedCarObjectBusiness,lapJobBbtobject,lapBtBusiness,lapBusiness,lapJobObject,homeImgObjectBusiness,cpLoad,homeImgObjectJob,imgObject,homebtObject2,homebtObject1,businessimgObject}