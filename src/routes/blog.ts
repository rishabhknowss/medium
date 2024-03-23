import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, verify, sign } from 'hono/jwt'

export const blogRouter = new Hono<{
  Bindings : {
    DATABASE_URL : string;
    JWT_SECRET : string
  },
  Variables : {
    userID : string
  }
}>()

blogRouter.use('/*',async (c,next)=>{
    const authHeader = c.req.header("authorization") || "";
    const user = await verify(authHeader , c.env.JWT_SECRET)
    console.log(user)
    if (!user){
        c.status(403)
    return c.text("not logged in")
    }
    
    c.set("userID",user.id);
        await next()
})


blogRouter.get('/bulk' , async (c)=>{

    const body = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try {
        const blog = await prisma.blog.findMany()
        return c.json({blog})

    }catch(e){
        c.status(411)
        return c.text("error ")
    }
  })

  blogRouter.get('/:id' , async (c)=>{

    const id = c.req.param('id')
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try {
        const blog = await prisma.blog.findFirst({
            where : {
                id : Number(id)
            }
        })
        return c.json({blog})

    }catch(e){
        c.status(411)
        return c.text("error ")
    }
  })





blogRouter.post('/', async (c) => {
    const body = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try {
        const authorId = c.get("userID")
        const blog = await prisma.blog.create({
            data : {
                title : body.title,
                content : body.content,
                authorId : Number(authorId)
            }
        })
        return c.json({
            id : blog.id,
            msg : "created"
        })

    }catch(e){
        c.status(411)
        return c.text("error ")
    }


    
  })
  
blogRouter.put('/', async (c) => {
    const body = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try {
        const blog = await prisma.blog.update({
            where : {
                id : body.id
            },
            data : {
                title : body.title,
                content : body.content
            }
        })
        return c.text("blog updated")

    }catch(e){
        c.status(411)
        return c.text("error ")
    }
  })
  

  