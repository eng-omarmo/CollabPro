const organization= require("../models/organizationModel");


const getOrg =async(req,res)=>{
    try {
        res.status(200).json({message:"get org"})
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

const getOrgById =async(req,res)=>{
    try {
        res.status(200).json({message:"get org by id"})
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

const createOrg =async(req,res)=>{
    try {
        res.status(200).json({message:"create org"})
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

const updateOrg =async(req,res)=>{
    try {
        res.status(200).json({message:"update org"})
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

const deleteOrg =async(req,res)=>{
    try {
        res.status(200).json({message:"delete org"})
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}


module.exports = {getOrg,getOrgById,createOrg,updateOrg,deleteOrg}