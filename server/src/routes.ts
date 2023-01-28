import dayjs from "dayjs";
import { FastifyInstance } from "fastify";
import {z} from 'zod';
import { prisma } from "./lib/prisma";

export async function appRoutes(app: FastifyInstance) {
    app.post("/habits", async (request) => {
        const createBodyHabit = z.object({
            title: z.string(),
            weekDays: z.array(z.number().min(0).max(6))
        });
        const {title, weekDays} = createBodyHabit.parse(request.body);
    
        const today = dayjs().startOf("day").toDate();
    
        await prisma.habit.create({
            data:{
                title,
                created_at: today,
                weekDays: {
                    create: weekDays.map(weekDay => {
                        return { week_day: weekDay, }
                    })
                }
            }
        });
    
    });

    app.get("/day", async (request) => {
        const createDateParams = z.object({
            date: z.coerce.date()
        })
        const { date } = createDateParams.parse(request.query);

        const parseDate = dayjs(date).startOf('day');
        const weekDay = parseDate.get('day');
        
        const possibleHabits = await prisma.habit.findMany({
            where: {
                created_at: {
                    lte: date
                },
                weekDays: {
                    some: {
                        week_day: weekDay
                    }
                }
            }
        })

        const day = await prisma.day.findUnique({
            where: {
                date: parseDate.toDate()
            },
            include: {
                dayHabits: true
            }
        
        })

        const completedHabits = day?.dayHabits.map(dayHabit => dayHabit.habit_id) ?? [];
        
        return {
            possibleHabits,
            completedHabits,
        }
    });
    
    app.patch("/habits/:id/toggle", async (request) => {

        const toggleHabitParamns = z.object({
            id: z.string().uuid()
        })

        const { id } = toggleHabitParamns.parse(request.params);

        const today = dayjs().startOf('day').toDate();

        let day = await prisma.day.findUnique({
            where: {
                date:today,
            }   
        })
        if(!day) {
            day = await prisma.day.create({
                data: {
                    date:today,
                }   
            })
        }

        const hadCreatedDayHabit = await prisma.dayHabit.findUnique({
            where:{
                day_id_habit_id: {
                    day_id: day.id,
                    habit_id:id,                    
                }
            }
        })
        
        if ( hadCreatedDayHabit ) {
            await prisma.dayHabit.delete({
                where:{
                    day_id_habit_id: {
                        day_id: day.id,
                        habit_id:id,                    
                    }
                }
            })
        }else{
            await prisma.dayHabit.create({
                data: {
                    day_id: day.id,
                    habit_id:id,
                }
            })
        }
        
    });

    app.get("/summary", async () => {
        // [ {date: 17/01, amount: 5, completed: 1}, {date: 18/01, amount:, completed}, {} ]

        const summary = await prisma.$queryRaw`
            SELECT 
                d.id,
                d.date,
                (
                    SELECT 
                        cast(count(*) as float)
                    FROM day_habits dh
                    WHERE 
                        dh.day_id = d.id
                ) as completed,
                (
                    SELECT 
                        cast(count(*) as float)
                    FROM  habit_week_days hwd
                    JOIN habits h 
                    ON h.id = hwd.habit_id
                    WHERE
                        hwd.week_day = cast(strftime('%w',d.date/1000.0,'unixepoch') as int)
                        AND h.created_at <= d.date
                ) as amount
            FROM days d
        `
    return summary;    
    });

    

}
