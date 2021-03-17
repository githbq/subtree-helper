function addAge(constructor: Function) {
    constructor.prototype.age = 18;
  }
  ​
  function method(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
     console.log(target);
     console.log("prop " + propertyKey);
     console.log("desc " + JSON.stringify(descriptor) + "\n\n");
  };
  ​
  @addAge
  class Hello{
    name: string;
    age: number;
    constructor() {
      console.log('hello');
      this.name = 'yugo';
    }
  ​
    @method
    hello(){
      return 'instance method';
    }
  ​
    @method
    static shello(){
      return 'static method';
    }
  }