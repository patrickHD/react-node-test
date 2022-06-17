/*
 * Students
 *
 * This page displays the list of students, at the '/students' route
 *
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux';
import DTNAPI from '../../utils/api';
import { useEffect, useState } from 'react';
import '../../styles/main.scss';

const DeleteConfirm = (props: { visible: boolean; id: Number; setShowDeleteBox: (arg0: boolean) => void; setUpdateFlag: (arg0: any) => void }) => {
    if (props.visible == true)
        return (
            <div className='dialogWrapper'>
                <div className='dialog'>
                    <div className='deleteConfirm'>
                        <h4>Are you sure you want to delete student #{props.id}</h4>
                        <button
                            type='button'
                            onClick={() => {
                                props.setShowDeleteBox(false);
                            }}
                        >No</button>
                        <button
                            type='button'
                            onClick={() => {
                                DTNAPI.deleteStudent(props.id).then(() => {
                                    props.setUpdateFlag([1]);
                                });
                                props.setShowDeleteBox(false);
                            }}
                        >Yes</button>
                    </div>
                </div>
            </div>
        );
    else
        return null
}

const StudentForm = (props: { id: Number; visible: boolean; editing: boolean; setShowForm: (arg0: Object) => void; setUpdateFlag: (arg0: any) => void }) => {
    if (props.visible == true) {
        const [student, setstudent] = useState<any>({ fname: '', lname: '', email: '', age: '', grade: '' });
        useEffect(() => {
            if (props.editing)
                DTNAPI.getStudent(props.id).then(res => {
                    setstudent(res);
                });
        }, [props.visible]);
        return (
            <div className='dialogWrapper'>
                <div className='dialog'>
                    <div className='studentForm'>
                        <h3>{props.editing ? "Edit Student" : "Add Student"}</h3>
                        <form>
                            <label>First Name</label>
                            <input type='text' name='fname' value={student?.fname} onChange={(e) => { setstudent({ ...student, fname: e.target.value }) }} required />
                            <label>Last Name</label>
                            <input type='text' name='lname' value={student?.lname} onChange={(e) => { setstudent({ ...student, lname: e.target.value }) }} required />
                            <label>Email Name</label>
                            <input type='text' name='email' value={student?.email} onChange={(e) => { setstudent({ ...student, email: e.target.value }) }} required />
                            <label>Age</label>
                            <input type='number' name='age' value={student?.age} onChange={(e) => { setstudent({ ...student, age: e.target.value }) }} required />
                            <label>Grade</label>
                            <input type='text' name='grade' value={student?.grade} onChange={(e) => { setstudent({ ...student, grade: e.target.value }) }} required />
                            <button
                                type='button'
                                onClick={() => {
                                    props.setShowForm({ visible: false, editing: false });
                                }}
                            >Cancel</button>
                            <button
                                type='submit'
                                onClick={(e) => {
                                    e.preventDefault();
                                    console.log(student);
                                    if (props.editing) {
                                        DTNAPI.editStudent(props.id, student).then(() => {
                                            props.setUpdateFlag([1]);
                                            setstudent({ fname: '', lname: '', email: '', age: '', grade: '' });
                                        });
                                    } else {
                                        DTNAPI.addStudent(student).then(() => {
                                            props.setUpdateFlag([1]);
                                            setstudent({ fname: '', lname: '', email: '', age: '', grade: '' });
                                        });
                                    }
                                    props.setShowForm({ visible: false, editing: false });
                                }}
                            >Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
    else {
        return null
    }
}

export default function Students() {
    const dispatch = useDispatch();
    const students = useSelector((state: RootStateOrAny) => state.students.students)
    const [showDeleteBox, setShowDeleteBox] = useState(false);
    const [showForm, setShowForm] = useState({ visible: false, editing: false });
    const [activeStudent, setactiveStudent] = useState(-1);
    const [updateFlag, setUpdateFlag] = useState(0)

    useEffect(() => {
        dispatch({
            type: 'GET_STUDENTS_START',
        });
        DTNAPI.getStudents().then(data => {
            if (data) {
                dispatch({
                    type: 'GET_STUDENTS_SUCCESS',
                    payload: data,
                });
            }
        });
    }, [updateFlag]);
    return (
        <div className='studentsPage'>
            <div className='header'>
                <FormattedMessage {...messages.header} />
            </div>
            <button
                onClick={() => {
                    setShowForm({ visible: true, editing: false });
                    setactiveStudent(-1);
                }}>
                Add
            </button>

            <StudentForm id={activeStudent} visible={showForm.visible} editing={showForm.editing} setShowForm={setShowForm} setUpdateFlag={setUpdateFlag} />
            <DeleteConfirm id={activeStudent} visible={showDeleteBox} setShowDeleteBox={setShowDeleteBox} setUpdateFlag={setUpdateFlag} />
            <table>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Age</th>
                        <th>Grade</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students && students.map((student: { fname: String; lname: String; email: String; age: Number; grade: String; }, index: React.Key) => (
                        (
                            <tr key={index}>
                                <td>{student.fname}</td>
                                <td>{student.lname}</td>
                                <td>{student.email}</td>
                                <td>{student.age}</td>
                                <td>{student.grade}</td>
                                <td>
                                    <button
                                        data-studentid={index}
                                        onClick={(e) => {
                                            setactiveStudent(e.target.getAttribute('data-studentid'));
                                            setShowForm({ visible: true, editing: true });
                                        }}>
                                        Edit
                                    </button>
                                    <button
                                        data-studentid={index}
                                        onClick={(e) => {
                                            setactiveStudent(e.target.getAttribute('data-studentid'));
                                            setShowDeleteBox(!showDeleteBox);
                                        }}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        )
                    ))}
                </tbody>
            </table>
        </div>
    );
}
