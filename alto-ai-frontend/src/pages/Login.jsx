import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken } from '../redux/authSlice';

export default function Login() {
    const dispatch = useDispatch();
    dispatch(setToken());
    const [searchParams, setSearchParams] = useSearchParams();
    const token = searchParams.get('token');
    dispatch(setToken(token));
    window.location.href = '/ai';
    return null;
}
