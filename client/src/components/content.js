function Content() {
    const searchParams = new URLSearchParams(location.search);
    const groupId = searchParams.get('id');
}

export default Content;