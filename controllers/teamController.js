const Team = require("../models/teamModel");

const express = require("express");
const router = express.Router();


const getTeam = async (req, res) => {
    try {
        const teams = await Team.find();
        res.status(200).json({ message: "Teams found", teams });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createTeam = async (req, res) => {
    try {
        const { name, description, orgId } = req.body;
        if (!name || !description || !orgId) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const authOrgId = req.user.orgId;
        if (authOrgId.toString() !== orgId.toString() && req.user.is_admin === true) {
            return res.status(401).json({ message: "Unauthorized to access this organization" });
        }
        const team = await Team.create({ name, description, orgId });
        res.status(201).json({ message: "Team created", team });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 const getTeamById = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        res.status(200).json({ message: "Team found", team });
    } catch (error) {
        res.status(500).json({ message: error.message });   
    }
 }
const updateTeam = async (req, res) => {
    try {
        const { name, description, orgId } = req.body;
        if (!name || !description || !orgId) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const authOrgId = req.user.orgId;
        if (authOrgId.toString() !== orgId.toString() && req.user.is_admin === true) {
            return res.status(401).json({ message: "Unauthorized to access this organization" });
        }
        const team = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: "Team updated", team });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};



const deleteTeam = async (req, res) => {
    try {
        const id = req.params.id;
        const authOrgId = req.user.orgId;
        const teamData = await Team.findById(id);
        if (authOrgId.toString() !== teamData.orgId.toString() && req.user.is_admin === true) {
            return res.status(401).json({ message: "Unauthorized to access this organization" });
        }
        const team = await Team.findByIdAndDelete(id);
        res.status(200).json({ message: "Team deleted", team });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};


module.exports = { createTeam , getTeam, getTeamById, updateTeam, deleteTeam }