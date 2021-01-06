const express = require('express');
const jwt = require('jsonwebtoken');
const AuthService = require('./auth-service');
function auth(req, res, next) {
  const token = req.header('Authorization');
  const jwtToken = token.split(' ')[1];

  if (!token.toLowerCase().startsWith('bearer')) {
    return res.status(400).json({ error: { message: 'Invalid Auth' } });
  }
  try {
    const decoded = AuthService.jwtVerify(jwtToken);
    req.user = {
      id: decoded.user_id,
      email: decoded.sub
    };
    next();
  } catch (error) {
    if (error) {
      return res.status(404).json({ error: { message: 'Invalid Auth' } });
    }
  }
}

module.exports = auth;
