class Student {
    fname: String;
    lname: String;
    email: String;
    age: Number;
    grade: String;

    constructor(fname: String, lname: String, email: String, age: Number, grade: String){
        this.fname = fname;
        this.lname = lname;
        this.email = email;
        this.age = age;
        this.grade = grade;
    }
}
export default Student;
module.exports = Student;