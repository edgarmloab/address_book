import axios from "axios";

export const getAllData = () => {
  return axios({
    method: "get",
    url: "/api/addresses/",
    headers: {
      Authorization: "Interviewer:H1r3m3?",
    },
  })
    .then(function (response) {
      return response.data.map((item) => {
        return {
          uuid_id: item.uuid_id,
          street_address: item.street_address,
          city: item.city,
          postal_code: item.postal_code,
          country: item.country,

        };
      });
    })
    .catch(function (error) {
      return false;
    });
};

export const postNewEntry = (row) => {
  return axios({
    method: "post",
    url: "/api/addresses/",
    headers: {
      Authorization: "Interviewer:H1r3m3?",
    },
    data: {
      street_address: row.street_address,
      city: row.city,
      postal_code: row.postal_code,
      country: row.country,
    },
  })
    .then(function (response) {
      return true;
    })
    .catch(function (error) {
      return false;
    });
};

export const updateEntry = (row) => {
    return axios({
      method: "put",
      url: `/api/addresses/${row.uuid_id}`,
      headers: {
        Authorization: "Interviewer:H1r3m3?",
      },
      data: {
        street_address: row.street_address,
        city: row.city,
        postal_code: row.postal_code,
        country: row.country,
      },
    })
      .then(function (response) {
        return true;
      })
      .catch(function (error) {
        console.log("Cannot update. Most likely this is a duplicate entry")
        return false;
      });
  };

  export const deleteEntry = (row) => {
    return axios({
      method: "delete",
      url: `/api/addresses/${row.uuid_id}`,
      headers: {
        Authorization: "Interviewer:H1r3m3?",
      },
    })
      .then(function (response) {
        return true;
      })
      .catch(function (error) {
        return false;
      });
  };
