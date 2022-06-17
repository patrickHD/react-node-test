export default class DTNAPI {
    static async getStudents(){
        return (await fetch('/api/students')).json();
    }
    static async getStudent(studentId: Number){
        return (await fetch(`/api/student/${studentId}`)).json();
    }
    static async deleteStudent(studentId: Number){
        return (await fetch(`/api/student/${studentId}`, {method: 'DELETE'}));
    }
    static async addStudent(student: { fname: String; lname: String; email: String; age: Number; grade: String; }){
        return (await fetch(
            '/api/student',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({student: student})
            }
            ));
    }
    static async editStudent(studentId: Number, student: { fname: String; lname: String; email: String; age: Number; grade: String; }){
        return (await fetch(
            `/api/student/${studentId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({student: student})
            }
            ));
    }
}