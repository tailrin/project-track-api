const express = require('express');
const jsonBodyParser = express.json();
const companyRouter = express.Router();
const CompanyService = require('./company-service')

companyRouter
    .post('/', jsonBodyParser, (req, res, next) => {
        const { company_name } = req.body;
        if (company_name.startsWith(' ') || company_name.endsWith(' ')) {
            return res.status(400).json({
              error: `Company name cannot start or end with a space!`
            })
        }

        CompanyService.hasCompanyWithCompanyName(req.app.get('db'), company_name)
        .then(hasCompanyWithCompanyName => {
            if(hasCompanyWithCompanyName){
                return res.status(400).json({ error: `Company name already taken` })
            }

            const newCompany = {
                company_name: company_name
            }

            return  CompanyService.insertCompany(req.app.get('db'), newCompany)
                .then(company => {
                    res
                        .status(200)
                        .json(company)
                }).catch(next)
        }).catch(next)
    })

module.exports = companyRouter