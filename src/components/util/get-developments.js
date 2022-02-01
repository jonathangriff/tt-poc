export default dataUrl => fetch(dataUrl)
    .then(response => response.json().then(data => ({ error: null, searchData: data })))
    .catch((error) => {
        // eslint-disable-next-line
        console.error('Search data API error', error);
        return { error, searchData: [] };
    });
