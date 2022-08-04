const fieldsArr = [
  {
    label: "UUID ID",
    name: "uuid_id",
    validation: (e) => {
      const name = e.target.value;
      return true;
    },
    error: "No validator here",
  },
  {
    label: "Street Address",
    name: "street_address",
    validation: (e) => {
      const name = e.target.value;
      if (name.length < 2) {
        return false;
      } else {
        return true;
      }
    },
    error: "Enter a street address longer than one character",
  },
  {
    label: "City",
    name: "city",
    validation: (e) => {
      const name = e.target.value;
      if (name.length < 2) {
        return false;
      } else {
        return true;
      }
    },
    error: "Enter a city name longer than one character",
  },
  {
    label: "Postal Code",
    name: "postal_code",
    validation: (e) => {
      const name = e.target.value;
      if (name.length > 12) {
        return false;
      } else {
        return true;
      }
    },
    error: "Postal codes are not this long are they now?",
  },
  {
    label: "Country",
    name: "country",
    validation: (e) => {
      const name = e.target.value;
      return true;
    },
    error: "No validator here",
  },
];

export default fieldsArr;
