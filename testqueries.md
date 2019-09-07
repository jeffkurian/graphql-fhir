query {
  AllergyIntoleranceList(patient: "12340237") {
    id
    entry {
      resource {
        ... on AllergyIntolerance {
          id
          category
          substance {
            coding {
              code
              display
            }
          }
          status
        }
      }
    }
  }
}

query {
  Patient(identifier: "223487984|12340237") {
    id
    name {
      family
      given
    }
    gender
  }
}

query {
  PatientList(identifier: "223487984|12340237") {
    total
    entry {
      resource {
        ... on Patient {
          id
          name {
            family
            given
          }
          gender
        }
      }
    }
  }
}

query {
  Patient(identifier: "223487984|12340237") {
    name {
      given
      family
    }
  }
  AllergyIntolerance(patient: { identifier: "223487984|12340237" }) {
    id
    reaction {
      substance {
        text
      }
    }
  }
}

query {
  AllergyIntolerance(patient: { identifier: "223487984|12340237" }) {
    id
    reaction {
      substance {
        text
      }
    }
  }
}

query {
  Patient(identifier: "223487984|12340237") {
    name {
      given
      family
    }
  }
  AllergyIntolerance(patient: { identifier: "223487984|12340237" }) {
    id
    reaction {
      substance {
        text
      }
    }
  }
}
