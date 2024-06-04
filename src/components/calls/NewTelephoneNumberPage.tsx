import React from 'react';
import NewTelephoneNumberForm from './NewTelephoneNumberForm';

const NewTelephoneNumberPage: React.FC = () => {
    const currentUser = localStorage.getItem("userId") || '';
    const handleSuccess = () => {
       
        console.log('New telephone number added successfully!');
    };

    return (
        <section className='container col-6 mt-5 mb-5'>
            <div className='row'>
                <div className='card col-md-6 offset-md-3 offset-md-3'>
                    <h1>Add New Telephone Number</h1>
                        <NewTelephoneNumberForm onSuccess={handleSuccess} user={currentUser} />
                </div>
            </div>
        </section>
    );
};

export default NewTelephoneNumberPage;