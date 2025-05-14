import React from 'react';
import { Card, Typography, Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { formatDate } from '../../utils/dateFormatter';

const LateFeeInfo = ({ lateFee, dueDate, returnDate }) => {
    const getFeeDescription = () => {
        if (!lateFee) return 'No late fee charged';
        
        return `Late Fee Breakdown:
        • First week: $2/day
        • Second week: $3/day
        • After two weeks: $5/day
        • Grace period: 2 days
        • Maximum fee: $100`;
    };

    return (
        <Card sx={{ p: 2, my: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Late Fee Information
                <Tooltip title={getFeeDescription()} placement="right">
                    <IconButton size="small" color="primary">
                        <InfoIcon sx={{ ml: 1, fontSize: 20, verticalAlign: 'middle', color: 'primary.main' }} />
                    </IconButton>
                </Tooltip>
            </Typography>
            <Typography>Due Date: {formatDate(dueDate)}</Typography>
            {returnDate && <Typography>Return Date: {formatDate(returnDate)}</Typography>}
            <Typography color={lateFee > 0 ? 'error' : 'success'} sx={{ mt: 1, fontWeight: 'bold' }}>
                Late Fee: ${lateFee?.toFixed(2) || '0.00'}
            </Typography>
        </Card>
    );
};

export default LateFeeInfo;
