import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const { 
  FiDollarSign, FiInfo, FiAward, FiTrendingDown, FiUsers,
  FiTrendingUp, FiPercent, FiCalculator, FiTarget, FiAlertTriangle,
  FiCheck, FiX, FiEdit, FiSave, FiRefreshCw, FiEye, FiBarChart2
} = FiIcons;