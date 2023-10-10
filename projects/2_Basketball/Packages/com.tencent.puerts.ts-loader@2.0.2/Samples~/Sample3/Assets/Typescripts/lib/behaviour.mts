function thrw() {
    let beforeStr
        :string 
        = 'before throw';
    let afterStr
        :string
        = 'after throw';

    console.log(beforeStr);

    throw new Error('throw');

    console.log(afterStr);
}



export default thrw;