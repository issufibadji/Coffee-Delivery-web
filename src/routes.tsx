import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
} from 'react-router-dom';

import { Home } from './pages/Home';
import { Order } from './pages/Order';
import { History } from './pages/History';
import { SuccessfulOrder } from './pages/SuccessfulOrder';
import { Login } from './pages/Login';
import { ProtectedRoute } from './routes/ProtectedRoute';

import { Header } from './components/Header';
import { Footer } from './components/Footer';

import { Container } from './components/Container';

export const Routes = () => {
  return (
    <Router>
      <Container>
        <Header />
        <Switch>
          <Route path="/order/success" element={<SuccessfulOrder />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          <Route path="/checkout" element={<Order />} />
          <Route path="/order" element={<Order />} />
          <Route path="/" element={<Home />} />
        </Switch>
        <Footer />
      </Container>
    </Router>
  );
};
