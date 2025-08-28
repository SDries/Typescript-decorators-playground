const memoizeMap = new Map();
const memoize = () => {
  return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;

    // className . methodName, so we can use one memoizeMap for any class & method
    const uniqueClassMethodPath = target.constructor.name+ '.'+ String(propertyKey);

    if (!memoizeMap.has(uniqueClassMethodPath)){
        memoizeMap.set(uniqueClassMethodPath, new Map());
    }
    const methodMap = memoizeMap.get(uniqueClassMethodPath);

    descriptor.value = async function (...args: unknown[]) {
      
        const memoizeKey = JSON.stringify(args);
        if (memoizeMap.has(memoizeKey)){
            return memoizeMap.get(memoizeKey);
        }

      const result = await method.apply(this, args);
      memoizeMap.set(memoizeKey, result);
     
      return result
    };
  }
}

const logDuration = (message: string) => {
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      const timeStart = Date.now();    
      const result = await method.apply(this, args);
      console.log(message, Date.now() - timeStart);
     
      return result
    };
  };
}

class CalculationLibrary {
    private sleep(ms: number) {
        return new Promise<void>((resolve) => setTimeout(resolve, ms));
    }
 
  @logDuration('heavyCalculation')
  @memoize()
	async heavyCalculation(args: number[]): Promise<number>{
       // simulation of a heavy calculation that takes a long time to complete
        await this.sleep(3000);
        const sum = args.reduce((a,b)=>a+b);
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
[LOG]: "heavyCalculation",  3003 
[LOG]: 3 
[LOG]: "heavyCalculation",  0 
[LOG]: 3 
[LOG]: "heavyCalculation",  3001 
[LOG]: 8 
[LOG]: "done in",  6007,  "ms" 
*/