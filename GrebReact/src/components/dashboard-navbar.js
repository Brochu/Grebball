import { useRef, useState } from 'react';
import styled from '@emotion/styled';

import PropTypes from 'prop-types';
import MenuIcon from '@mui/icons-material/Menu';

import { AppBar, Box, Button, IconButton, Toolbar } from '@mui/material';
import { useSession, signIn, signOut } from 'next-auth/react';

import { AccountPopover } from './account-popover';

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3]
}));

export const DashboardNavbar = (props) => {
    const { onSidebarOpen, ...other } = props;
    const settingsRef = useRef(null);
    const [openAccountPopover, setOpenAccountPopover] = useState(false);
    
    const handleSignIn = (e) => {
        e.preventDefault();
        signIn('google', null, {prompt: "select_account"});
    }

    const handleSignOut = (e) => {
        e.preventDefault();
        signOut();
    }
    const { data: session } = useSession();

    return (
        <>
        <DashboardNavbarRoot
            sx={{
                left: {
                    lg: 280
                },
                    width: {
                        lg: 'calc(100% - 280px)'
                    }
            }}
            {...other}
        >
            <Toolbar disableGutters sx={{ minHeight: 64, left: 0, px: 2 }}>
                <IconButton
                    onClick={onSidebarOpen}
                    sx={{
                        display: {
                            xs: 'inline-flex',
                                lg: 'none'
                        }
                    }}
                >
                <MenuIcon fontSize="small" />
                </IconButton>

                <Box sx={{ flexGrow: 1 }} />
                { session && <a href="#" onClick={handleSignOut} className="btn-signin"> Sign Out </a> }
                { !session && <a href="#" onClick={handleSignIn} className="btn-signin"> Sign In </a> }
            </Toolbar>
        </DashboardNavbarRoot>
        <AccountPopover
            anchorEl={settingsRef.current}
            open={openAccountPopover}
            onClose={() => setOpenAccountPopover(false)}
        />
        </>
    );
};

DashboardNavbar.propTypes = {
    onSidebarOpen: PropTypes.func
};
