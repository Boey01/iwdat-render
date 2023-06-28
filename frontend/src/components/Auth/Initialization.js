import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { checkAuthenticated, load_user } from '../../redux/actions/auth_actions';

const Initialization = ({ checkAuthenticated, load_user, isAuthenticated ,children }) => {
    useEffect(() => {
        checkAuthenticated();
    }, []);

    useEffect(() => {
        if(isAuthenticated){
            load_user();
            }
      }, [isAuthenticated]);

    return (
        <div>
            {children}
         </div>
    );
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.authReducer.isAuthenticated,
  });

export default connect(mapStateToProps, { checkAuthenticated, load_user })(Initialization);