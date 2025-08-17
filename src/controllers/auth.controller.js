const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const generateTokens = require('../utils/generateTokens');

exports.register = async (req, )