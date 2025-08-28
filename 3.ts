class CalculationLibrary {
    private heavyCalculationMap = new Map();

    private sleep(ms: number) {
        return new Promise<void>((resolve) => setTimeout(resolve, ms));
    }
 
	async heavyCalculation(args: number[]): Promise<number>{
        const timeStart = Date.now();

        const memoizeKey = JSON.stringify(args);
        if (this.heavyCalculationMap.has(memoizeKey)){
          console.log('memoized result', Date.now() - timeStart);
            return this.heavyCalculationMap.get(memoizeKey);
        }
	 	    // simulation of a heavy calculation that takes a long time to complete
        await this.sleep(3000);
        const sum = args.reduce((a,b)=>a+b);

         this.heavyCalculationMap.set(memoizeKey, sum);

        console.log('heavyCalculation', Date.now() - timeStart);
        return sum;
  	}
}

const lib = new CalculationLibrary();

const timeStart = Date.now();

lib.heavyCalculation([1,2]).then((resp) => {
  console.log(resp);
  return  lib.heavyCalculation([1,2]);
}).then((resp) => {
  console.log(resp);
  return  lib.heavyCalculation([3,5]);
}).then((resp) => {
  console.log(resp);
}).then(() => console.log('done in', Date.now() - timeStart, 'ms'));

/*
[LOG]: "heavyCalculation",  3001 
[LOG]: 3 
[LOG]: "memoized result",  0 
[LOG]: 3 
[LOG]: "heavyCalculation",  3015 
[LOG]: 8 
[LOG]: "done in",  6027,  "ms" 
*/