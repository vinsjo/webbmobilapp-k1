const uuid = require('uuid');
const fs = require('fs');
const path = require('path');
const prompts = require('prompts');
const kolorist = require('kolorist');
const { isObj, isArr } = require('x-is-type/callbacks');

/**
 * @typedef {{id:string,name:string,color:string|null}} Project
 * @typedef {{id:string,projectId:string,title:string}} Task
 * @typedef {{id:string,taskId:string,start:number,end:number}} Timelog
 */

/**
 *
 * @param  {{project:{name:string,color?:string},tasks:string[]}[]} [dummyData]
 * @returns {{projects:Project[],tasks?:Task[],timelogs:Timelog[]}}
 */
const createOutput = (dummyData) => {
    const end = Date.now();

    const output = {
        projects: [],
        tasks: [],
        timelogs: [],
    };
    if (!isArr(dummyData)) return output;
    dummyData
        .filter((entry) => isObj(entry) && isObj(entry.project))
        .forEach(({ project: { name, color }, tasks }) => {
            if (!name) return;
            const projectId = uuid.v4();
            output.projects.push({
                id: projectId,
                name,
                color: color || null,
            });
            if (!isArr(tasks)) return;
            tasks.forEach((title) => {
                if (!title) return;
                const taskId = uuid.v4();
                output.tasks.push({ id: taskId, projectId, title });
                const start =
                    end - (3600 * 1000 * Math.floor(Math.random() * 12) + 1);
                output.timelogs.push({
                    id: uuid.v4(),
                    taskId,
                    start,
                    end,
                });
            });
        });

    return output;
};

(async () => {
    try {
        const dbPath = path.resolve(__dirname, 'db.json');
        const dbExists = fs.existsSync(dbPath);
        const onCancel = () => {
            throw new Error(`${kolorist.red('✖')} Operation cancelled`);
        };
        const { dummyData } = await prompts(
            [
                {
                    type: !dbExists ? null : 'toggle',
                    name: 'overwrite',
                    message:
                        'db.json already exists, overwrite with an empty one?',
                    initial: false,
                    active: 'yes',
                    inactive: 'no',
                },
                {
                    type: (_, { overwrite }) => {
                        if (overwrite === false) onCancel();
                        return null;
                    },
                },
                {
                    type: 'toggle',
                    name: 'dummyData',
                    message: 'Initialize db.json with dummy data?',
                    initial: false,
                    active: 'yes',
                    inactive: 'no',
                },
            ],
            {
                onCancel,
            }
        );
        const output = createOutput(
            !dummyData
                ? null
                : [
                      {
                          project: { name: 'Kunskapskontroll' },
                          tasks: [
                              'Läsa instruktioner',
                              'Fixa db.json',
                              'Fixa frontend',
                          ],
                      },
                  ]
        );

        await fs.promises.writeFile(
            dbPath,
            JSON.stringify(output, undefined, 4),
            'utf-8'
        );
    } catch (err) {
        console.log(err instanceof Error ? err.message : err);
    }
})();
