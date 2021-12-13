const baseUrl = "http://3.144.209.214:5000/api/"
const wikipediaUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/'

const url = {
  countries: "https://corona.lmao.ninja/v2/countries",
  total: "https://disease.sh/v3/covid-19/all",
  search: baseUrl + 'search',
  news: baseUrl + 'getnews',
  countrytweet: baseUrl + 'country',
  pois: baseUrl + 'pois',
  wiki: wikipediaUrl,
  global: baseUrl + 'global'
}

export const environment = {
  production: false,
  ...url,
};
