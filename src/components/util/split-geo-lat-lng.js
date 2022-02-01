export default (geo) => {
    const lat = parseFloat(geo.split(',')[0]);
    const lng = parseFloat(geo.split(',')[1]);

    return { lat, lng };
};
