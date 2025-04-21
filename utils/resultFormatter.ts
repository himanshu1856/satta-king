export const resultFormatter = (result: number):string => {
    console.log(`😀 ${result}`);
    
    if (result === null || result === -1) return "XX";

    if (result % 10 == result){
        console.log(result);
        
        return "0" + result.toString();
    };
    return result + "";
}