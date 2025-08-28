class CalculationLibrary {
  private sleep(ms: number) {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
  }

  async heavyCalculation(args: number[]): Promise<number> {
    // simulation of a heavy calculation that takes a long time to complete
    await this.sleep(3000);
    return args.reduce((a, b) => a + b);
  }
}

const lib = new CalculationLibrary();

const a = lib.heavyCalculation([1, 2]);
const b = lib.heavyCalculation([1, 2]);
const c = lib.heavyCalculation([3, 5]);


a.then((resp) => {
  console.log(resp);
  return b;
}).then((resp) => {
  console.log(resp);
  return c;
}).then((resp) => {
  console.log(resp);
}).then(() => console.log('done'));

/*
[LOG]: 3 
[LOG]: 3 
[LOG]: 8 
[LOG]: "done" 
*/