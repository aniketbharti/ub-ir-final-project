const baseUrl = "http://3.133.92.115:5000/api/"

const url = {
  countries: "https://corona.lmao.ninja/v2/countries",
  total: "https://disease.sh/v3/covid-19/all",
  search: baseUrl + 'search',
  news: baseUrl + 'getnews',
  countrytweet: baseUrl + 'country',
  pois: baseUrl + 'pois'
}

export const environment = {
  production: false,
  ...url,
};
