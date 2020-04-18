
const CompanyService = {
    hasCompanyWithCompanyName: (db, company_name) => {
        return db('company')
            .where('company_name', company_name)
            .first()
            .then(company => !!company)
    },
    insertCompany(db, newCompany) {
        return db
          .insert(newCompany)
          .into('company')
          .returning('*')
          .then(([company]) => company)
    },
    getIdByName(db, company_name){
        return db('company')
            .where('company_name', company_name)
            .first()
            .then(company => company.id)
    }
}

module.exports = CompanyService;