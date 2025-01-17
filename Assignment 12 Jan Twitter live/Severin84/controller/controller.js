const express=require("express")
const data = require("../../commit/data.json")
const getSlug=(res,req)=>{
    try{
        console.log("o");
        const {slug}=req.body;
        console.log("k")
        if(!slug){
             return res.status(400).json({message:"Insufficent Data"});
        }

        const slugresult=data.filter((data)=>data.slug.trim().toLowerCase()===slug.trim().toLowerCase());

        return res.status(200).json({message:slugresult});

    }catch(error){
        return res.status(500).json({message:"Something went wrong while getting the Slug"})
    }
}


const Search=(req,res)=>{
    try{
        const {title,description}=req.body;

        if(!title||!description){
             return res.status(400).json({message:"Insufficent Data"});
        }
        
        if(title){
            const Titleresult=data.filter((data)=>data.title.trim().toLowerCase()===title.trim().toLowerCase());
            return res.status(200).json({message:Titleresult})
        }else if(description){
            const DesResult=data.filter((data)=>data.description.trim().toLowerCase()===description.trim().toLowerCase());
            return res.status(200).json({message:DesResult})
        }else{
            const Titleresult=data.filter((data)=>data.title.trim().toLowerCase()===title.trim().toLowerCase());
            return res.status(200).json({message:Titleresult})
        }
    }catch(error){
        return res.status(500).json({message:"Something went wrong while Searching"})
    }
}


const DeleteSlug=(res,req)=>{
    try{
        const {slug,title,description}=req.body;

        if(!slug||!title||!description){
             return res.status(400).json({message:"Insufficent Data"});
        }
        
        const deteled=data.map((datas)=>{
              if(datas.slug===slug||datas.title===title||datas.description===description){
                  datas.created=null;
              }
        })

        res.status(200).json({message:"Deleted"})
    }catch(error){
        return res.status(500).json({message:"Something went wrong while Searching"})
    }
}

const update=(req,res)=>{
    try{
        const {slug,description}=req.body;

        if(!slug||!description){
             return res.status(400).json({message:"Insufficent Data"});
        }
        
        const updated=data.map((datas)=>{
             if(datas.slug===slug){
                 datas.description=description;
             }
        })
        
        res.status(200).json({message:"Updated"})
    }catch(error){
        return res.status(500).json({message:"Something went wrong while Updating"})
    }
}

module.exports={getSlug,Search,DeleteSlug,update}