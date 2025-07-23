
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
app.use(cors());
app.use(express.json());

// Importar modelos desde modelodatos.js
const { sequelize, Rol, Usuario, Curso, SolicitudCurso, MaterialCurso } = require('./datos/modelodatos');
const { Op } = require('sequelize');

// Verificar conexión antes de sincronizar modelos
sequelize.authenticate()
    .then(() => {
        console.log("Conexión exitosa a SQL Server");
        return sequelize.sync({ force: false });
    })
    .then(() => {
        console.log('Modelo sincronizado con la base de datos');
    })
    .catch(err => {
        console.error("Error de conexión o sincronización:", err);
    });

// Middleware para verificar token JWT
const verificarToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(403).json({ mensaje: 'Token no proporcionado' });
    }

<<<<<<< HEAD
    // 2. Verificar si el usuario ya existe (por nombre de usuario o correo)
    const usuarioExistente = await Usuario.findOne({
      where: {
        [Op.or]: [
          { NombreUsuario: nombreUsuario },
          { Correo: correo }
        ]
      }
    });

    if (usuarioExistente) {
      return res.status(400).json({
        mensaje: 'El nombre de usuario o correo ya está registrado'
      });
    }

    // 4. Verificar una última vez antes de crear (por si hubo una creación simultánea)
    const verificacionFinal = await Usuario.findOne({
      where: {
        [Op.or]: [
          { NombreUsuario: nombreUsuario },
          { Correo: correo }
        ]
      }
    });

    if (verificacionFinal) {
      return res.status(400).json({
        mensaje: 'El usuario ya fue registrado'
      });
    }

    // 5. Crear el nuevo usuario con rol de usuario (ID: 1)
    const nuevoUsuario = await Usuario.create({
      NombreUsuario: nombreUsuario,
      Correo: correo,
      ClaveHash: contraseña, // Guardando la contraseña tal cual se ingresa
      IdRol: 1, // ID del rol 'usuario' que ya existe en la base de datos
      EstaActivo: true
    });

    // 5. Preparar la respuesta (omitiendo datos sensibles)
    const usuarioCreado = {
      id: nuevoUsuario.IdUsuario,
      nombreUsuario: nuevoUsuario.NombreUsuario,
      correo: nuevoUsuario.Correo,
      fechaRegistro: nuevoUsuario.FechaRegistro
    };

    // 6. Generar token de autenticación
    const token = jwt.sign(
      { id: nuevoUsuario.IdUsuario, rol: 'usuario' },
      'secreto', // En producción, usar variable de entorno
      { expiresIn: '1h' }
    );

    // 7. Enviar respuesta
    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: usuarioCreado,
      token: token
    });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({
      mensaje: 'Error al registrar usuario',
      error: error.message,
      detalles: error.errors ? error.errors.map(e => e.message) : []
    });
  }
});
// Endpoint para registrar una nueva película (solo admin)
app.post('/peliculas/registro', async (req, res) => {
  try {
    const {
      Titulo,
      Sinopsis,
      AnioEstreno,
      IdDirector,
      UrlPoster,
      UrlTrailer
    } = req.body;

    // Validación básica
    if (!Titulo || !AnioEstreno) {
      return res.status(400).json({ mensaje: 'Título y año de estreno son obligatorios.' });
    }

    // Crear la película directamente como publicada
    const nuevaPelicula = await Pelicula.create({
      Titulo,
      Sinopsis: Sinopsis || null,
      AnioEstreno,
      IdDirector: IdDirector || null,
      UrlPoster: UrlPoster || null,
      UrlTrailer: UrlTrailer || null,
      Estado: 'Publicado', // Ahora se publica directamente
      FechaPublicacion: sequelize.literal('GETDATE()'),
      CalificacionPromedio: null
    });

    res.status(201).json({
      mensaje: 'Película registrada exitosamente',
      pelicula: nuevaPelicula
    });

  } catch (error) {
    console.error('Error al registrar la película:', error);
    res.status(500).json({
      mensaje: 'Error al registrar la película',
      error: error.message
    });
  }
});

// Endpoint para actualizar una película (solo admin)
app.put('/peliculas/actualizar/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      Titulo,
      Sinopsis,
      AnioEstreno,
      IdDirector,
      UrlPoster,
      UrlTrailer
    } = req.body;

    // Buscar la película
    const pelicula = await Pelicula.findByPk(id);

    if (!pelicula) {
      return res.status(404).json({ mensaje: 'Película no encontrada' });
    }

    // Actualizar los campos
    await pelicula.update({
      Titulo: Titulo || pelicula.Titulo,
      Sinopsis: Sinopsis || pelicula.Sinopsis,
      AnioEstreno: AnioEstreno || pelicula.AnioEstreno,
      IdDirector: IdDirector || pelicula.IdDirector,
      UrlPoster: UrlPoster || pelicula.UrlPoster,
      UrlTrailer: UrlTrailer || pelicula.UrlTrailer
    });

    res.json({
      mensaje: 'Película actualizada exitosamente',
      pelicula
    });

  } catch (error) {
    console.error('Error al actualizar la película:', error);
    res.status(500).json({
      mensaje: 'Error al actualizar la película',
      error: error.message
    });
  }
});

// Endpoint para eliminar una película (solo admin)
app.delete('/peliculas/eliminar/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar la película
    const pelicula = await Pelicula.findByPk(id);

    if (!pelicula) {
      return res.status(404).json({ mensaje: 'Película no encontrada' });
    }

    // Eliminar la película
    await pelicula.destroy();

    res.json({
      mensaje: 'Película eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar la película:', error);
    res.status(500).json({
      mensaje: 'Error al eliminar la película',
      error: error.message
    });
  }
});

// Endpoint para obtener todas las películas publicadas
app.get('/peliculas', async (req, res) => {
=======
>>>>>>> 39f832152d9497dbc28fa81e5993812bc0d44458
    try {
        const decoded = jwt.verify(token, 'secreto');
        req.usuario = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ mensaje: 'Token inválido' });
    }
};

// Middleware para verificar roles
const verificarRol = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.usuario.rol)) {
            return res.status(403).json({ 
                mensaje: 'No tienes permiso para realizar esta acción' 
            });
        }
        next();
    };
};

// Middleware para verificar que el profesor esté activo
const verificarProfesorActivo = async (req, res, next) => {
    try {
        const profesor = await Usuario.findOne({
            where: {
                IdUsuario: req.usuario.id,
                RolId: 2, // ID del rol profesor
                EstadoCuenta: 'activo'
            }
        });

        if (!profesor) {
            return res.status(403).json({
                mensaje: 'Solo profesores activos pueden realizar esta acción'
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al verificar estado del profesor',
            error: error.message
        });
    }
};

// Middleware para verificar acceso al curso
const verificarAccesoCurso = async (req, res, next) => {
    try {
        const { cursoId } = req.params;
        const alumnoId = req.usuario.id;

        const solicitud = await SolicitudCurso.findOne({
            where: {
                CursoId: cursoId,
                AlumnoId: alumnoId,
                EstadoSolicitud: 'aceptado'
            }
        });

        if (!solicitud) {
            return res.status(403).json({
                mensaje: 'No tienes acceso a este curso'
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al verificar acceso al curso',
            error: error.message
        });
    }
};
// Aprobar/Rechazar cuenta de usuario
app.put('/usuarios/:usuarioId/estado', verificarToken, verificarRol(['Administrador']), async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const { estado } = req.body;

        if (!['activo', 'rechazado'].includes(estado)) {
            return res.status(400).json({
                mensaje: 'Estado no válido'
            });
        }

        const usuario = await Usuario.findByPk(usuarioId);

        if (!usuario) {
            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });
        }

        usuario.EstadoCuenta = estado;
        await usuario.save();

        res.json({
            mensaje: 'Estado de cuenta actualizado exitosamente',
            usuario
        });

    } catch (error) {
        console.error('Error al actualizar estado de cuenta:', error);
        res.status(500).json({
            mensaje: 'Error al actualizar el estado de cuenta',
            error: error.message
        });
    }
});
// LOGIN
app.post('/login', async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        // Validar campos requeridos
        if (!correo || !contrasena) {
            return res.status(400).json({
                mensaje: 'Correo y contraseña son requeridos'
            });
        }

        // Buscar usuario por correo e incluir información del rol
        const usuario = await Usuario.findOne({
            where: { 
                Correo: correo 
            },
            include: [{
                model: Rol,
                as: 'Rol',
                required: true,
                attributes: ['IdRol', 'NombreRol']
            }],
            attributes: ['IdUsuario', 'NombreCompleto', 'Contrasena', 'Telefono', 'Distrito', 'EstadoCuenta', 'FechaRegistro', 'RolId']
        });

        // Log para diagnóstico
        console.log('Intento de login:', {
            correo,
            usuarioEncontrado: !!usuario,
            rolId: usuario?.RolId,
            rolInfo: usuario?.Rol ? {
                id: usuario.Rol.IdRol,
                nombre: usuario.Rol.NombreRol
            } : 'No encontrado'
        });

        if (!usuario) {
            return res.status(401).json({
                mensaje: 'Usuario no encontrado'
            });
        }

        // Verificar contraseña
        if (contrasena !== usuario.Contrasena) {
            return res.status(401).json({
                mensaje: 'Contraseña incorrecta'
            });
        }

        // Verificar estado de cuenta
        if (usuario.EstadoCuenta !== 'activo') {
            return res.status(401).json({
                mensaje: 'Tu cuenta no está activa. Estado actual: ' + usuario.EstadoCuenta
            });
        }

        // Verificar que el rol existe
        if (!usuario.Rol || !usuario.Rol.NombreRol) {
            console.error('Error de rol:', {
                usuarioId: usuario.IdUsuario,
                rolId: usuario.RolId,
                rolObjeto: usuario.Rol
            });
            return res.status(500).json({
                mensaje: 'Error en la configuración del rol del usuario',
                debug: {
                    tieneRol: !!usuario.Rol,
                    rolId: usuario.RolId
                }
            });
        }

        // Generar token JWT
        const token = jwt.sign(
            {
                id: usuario.IdUsuario,
                rol: usuario.Rol.NombreRol,
                nombre: usuario.NombreCompleto
            },
            'secreto',
            { expiresIn: '24h' }
        );

        // Enviar respuesta
        res.json({
            mensaje: 'Inicio de sesión exitoso',
            token,
            usuario: {
                id: usuario.IdUsuario,
                nombre: usuario.NombreCompleto,
                rol: usuario.Rol.NombreRol,
                telefono: usuario.Telefono,
                distrito: usuario.Distrito,
                fechaRegistro: usuario.FechaRegistro,
                estadoCuenta: usuario.EstadoCuenta
            }
        });

    } catch (error) {
        console.error('Error detallado en login:', error);
        res.status(500).json({
            mensaje: 'Error al procesar el inicio de sesión',
            error: error.message,
            detalles: 'Por favor, verifique que el usuario tenga un rol asignado correctamente'
        });
    }
});

// REGISTRO DE USUARIOS
app.post('/registro', async (req, res) => {
    try {
        const { nombreCompleto, correo, contrasena, telefono, distrito, tipo } = req.body;

        // Validar campos requeridos
        if (!nombreCompleto || !correo || !contrasena || !tipo) {
            return res.status(400).json({
                mensaje: 'Nombre completo, correo, contraseña y tipo de usuario son requeridos',
                campos_requeridos: ['nombreCompleto', 'correo', 'contrasena', 'tipo']
            });
        }

        // Validar tipo de usuario
        if (!['alumno', 'profesor'].includes(tipo)) {
            return res.status(400).json({
                mensaje: 'El tipo de usuario debe ser "alumno" o "profesor"'
            });
        }

        const usuarioExistente = await Usuario.findOne({
            where: { Correo: correo }
        });

        if (usuarioExistente) {
            return res.status(400).json({
                mensaje: 'El correo ya está registrado'
            });
        }

        // Asignar RolId según el tipo (2 para profesor, 3 para alumno)
        const rolId = tipo === 'profesor' ? 2 : 3;

        // Estado de cuenta inicial según el tipo
        // Los profesores requieren aprobación, los alumnos son activados automáticamente
        const estadoCuenta = tipo === 'profesor' ? 'pendiente' : 'activo';

        const nuevoUsuario = await Usuario.create({
            NombreCompleto: nombreCompleto,
            Correo: correo,
            Contrasena: contrasena,
            Telefono: telefono,
            Distrito: distrito,
            RolId: rolId,
            EstadoCuenta: estadoCuenta
        });

        res.status(201).json({
            mensaje: tipo === 'profesor' 
                ? 'Registro exitoso. Un administrador revisará y aprobará tu cuenta.'
                : 'Usuario registrado exitosamente',
            usuario: {
                id: nuevoUsuario.IdUsuario,
                nombre: nuevoUsuario.NombreCompleto,
                correo: nuevoUsuario.Correo,
                tipo: tipo,
                estadoCuenta: nuevoUsuario.EstadoCuenta
            }
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            mensaje: 'Error al registrar usuario',
            error: error.message
        });
    }
});

// GESTIÓN DE CURSOS

// Listar todos los cursos disponibles (para alumnos)
app.get('/api/cursos', verificarToken, async (req, res) => {
    try {
        const { nombre, distrito, materia } = req.query;
        const alumnoId = req.usuario.id;

        // Construir where clause basado en filtros
        const whereClause = {};
        if (nombre) {
            whereClause.NombreCurso = { [Op.like]: `%${nombre}%` };
        }

        // Obtener cursos donde el alumno no está inscrito
        const cursosInscritos = await SolicitudCurso.findAll({
            where: { AlumnoId: alumnoId },
            attributes: ['CursoId']
        });

        const cursosInscritosIds = cursosInscritos.map(s => s.CursoId);

        const cursos = await Curso.findAll({
            where: {
                IdCurso: { [Op.notIn]: cursosInscritosIds },
                ...whereClause
            },
            include: [{
                model: Usuario,
                as: 'Profesor',
                where: { 
                    EstadoCuenta: 'activo',
                    ...(distrito && { Distrito: distrito })
                },
                attributes: ['NombreCompleto', 'Distrito', 'Telefono']
            }],
            order: [['FechaCreacion', 'DESC']]
        });

        res.json(cursos);

    } catch (error) {
        console.error('Error al obtener cursos:', error);
        res.status(500).json({
            mensaje: 'Error al obtener los cursos',
            error: error.message
        });
    }
});

// Ver detalle de un curso
app.get('/api/cursos/:id', verificarToken, async (req, res) => {
    try {
        const { id } = req.params;
        const curso = await Curso.findByPk(id, {
            include: [{
                model: Usuario,
                as: 'Profesor',
                attributes: ['NombreCompleto', 'Distrito', 'Telefono']
            }]
        });

        if (!curso) {
            return res.status(404).json({
                mensaje: 'Curso no encontrado'
            });
        }

        res.json(curso);

    } catch (error) {
        console.error('Error al obtener detalle del curso:', error);
        res.status(500).json({
            mensaje: 'Error al obtener el detalle del curso',
            error: error.message
        });
    }
});

// Crear curso (profesor)
app.post('/api/cursos', verificarToken, verificarRol(['profesor']), verificarProfesorActivo, async (req, res) => {
    try {
        const { nombreCurso, descripcion, fechaInicio, fechaFin, horario } = req.body;

        // Validaciones
        if (!nombreCurso || !fechaInicio || !fechaFin || !horario) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        const nuevoCurso = await Curso.create({
            ProfesorId: req.usuario.id,
            NombreCurso: nombreCurso,
            Descripcion: descripcion,
            FechaInicio: fechaInicio,
            FechaFin: fechaFin,
            Horario: horario
        });

        res.status(201).json({
            mensaje: 'Curso creado exitosamente',
            curso: nuevoCurso
        });

    } catch (error) {
        console.error('Error al crear curso:', error);
        res.status(500).json({
            mensaje: 'Error al crear el curso',
            error: error.message
        });
    }
});

// Editar curso (profesor)
app.put('/api/cursos/:id', verificarToken, verificarRol(['profesor']), verificarProfesorActivo, async (req, res) => {
    try {
        const { id } = req.params;
        const { nombreCurso, descripcion, fechaInicio, fechaFin, horario } = req.body;

        const curso = await Curso.findOne({
            where: {
                IdCurso: id,
                ProfesorId: req.usuario.id
            }
        });

        if (!curso) {
            return res.status(404).json({
                mensaje: 'Curso no encontrado o no tienes permiso para editarlo'
            });
        }

        await curso.update({
            NombreCurso: nombreCurso,
            Descripcion: descripcion,
            FechaInicio: fechaInicio,
            FechaFin: fechaFin,
            Horario: horario
        });

        res.json({
            mensaje: 'Curso actualizado exitosamente',
            curso
        });

    } catch (error) {
        console.error('Error al actualizar curso:', error);
        res.status(500).json({
            mensaje: 'Error al actualizar el curso',
            error: error.message
        });
    }
});

// Eliminar curso (profesor)
app.delete('/api/cursos/:id', verificarToken, verificarRol(['profesor']), verificarProfesorActivo, async (req, res) => {
    try {
        const { id } = req.params;

        const curso = await Curso.findOne({
            where: {
                IdCurso: id,
                ProfesorId: req.usuario.id
            }
        });

        if (!curso) {
            return res.status(404).json({
                mensaje: 'Curso no encontrado o no tienes permiso para eliminarlo'
            });
        }

        await curso.destroy();

        res.json({
            mensaje: 'Curso eliminado exitosamente'
        });

    } catch (error) {
        console.error('Error al eliminar curso:', error);
        res.status(500).json({
            mensaje: 'Error al eliminar el curso',
            error: error.message
        });
    }
});

// Listar cursos creados por un profesor
app.get('/api/profesor/:id/cursos', verificarToken, verificarRol(['profesor']), verificarProfesorActivo, async (req, res) => {
    try {
        const cursos = await Curso.findAll({
            where: { ProfesorId: req.usuario.id },
            include: [{
                model: SolicitudCurso,
                include: [{
                    model: Usuario,
                    as: 'Alumno',
                    attributes: ['NombreCompleto', 'Correo', 'Telefono']
                }]
            }],
            order: [['FechaCreacion', 'DESC']]
        });

        res.json(cursos);

    } catch (error) {
        console.error('Error al obtener cursos del profesor:', error);
        res.status(500).json({
            mensaje: 'Error al obtener los cursos',
            error: error.message
        });
    }
});

// GESTIÓN DE SOLICITUDES

// Enviar solicitud a curso (alumno)
app.post('/api/solicitudes', verificarToken, verificarRol(['alumno']), async (req, res) => {
    try {
        const { cursoId } = req.body;

        const solicitudExistente = await SolicitudCurso.findOne({
            where: {
                CursoId: cursoId,
                AlumnoId: req.usuario.id
            }
        });

        if (solicitudExistente) {
            return res.status(400).json({
                mensaje: 'Ya has enviado una solicitud para este curso'
            });
        }

        const nuevaSolicitud = await SolicitudCurso.create({
            CursoId: cursoId,
            AlumnoId: req.usuario.id
        });

        res.status(201).json({
            mensaje: 'Solicitud enviada exitosamente',
            solicitud: nuevaSolicitud
        });

    } catch (error) {
        console.error('Error al crear solicitud:', error);
        res.status(500).json({
            mensaje: 'Error al enviar la solicitud',
            error: error.message
        });
    }
});

// Ver solicitudes de cursos recibidas (profesor)
app.get('/api/profesor/:id/solicitudes', verificarToken, verificarRol(['profesor']), verificarProfesorActivo, async (req, res) => {
    try {
        const solicitudes = await SolicitudCurso.findAll({
            include: [{
                model: Curso,
                where: { ProfesorId: req.usuario.id },
                attributes: ['NombreCurso']
            }, {
                model: Usuario,
                as: 'Alumno',
                attributes: ['NombreCompleto', 'Correo', 'Telefono', 'Distrito']
            }],
            where: { EstadoSolicitud: 'pendiente' },
            order: [['FechaSolicitud', 'DESC']]
        });

        res.json(solicitudes);

    } catch (error) {
        console.error('Error al obtener solicitudes:', error);
        res.status(500).json({
            mensaje: 'Error al obtener las solicitudes',
            error: error.message
        });
    }
});

// Aceptar/Rechazar solicitud (profesor)
app.put('/api/solicitudes/:id', verificarToken, verificarRol(['profesor']), verificarProfesorActivo, async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!['aceptado', 'rechazado'].includes(estado)) {
            return res.status(400).json({
                mensaje: 'Estado no válido'
            });
        }

        const solicitud = await SolicitudCurso.findOne({
            include: [{
                model: Curso,
                where: { ProfesorId: req.usuario.id }
            }],
            where: { IdSolicitud: id }
        });

        if (!solicitud) {
            return res.status(404).json({
                mensaje: 'Solicitud no encontrada o no tienes permiso para modificarla'
            });
        }

        solicitud.EstadoSolicitud = estado;
        await solicitud.save();

        res.json({
            mensaje: 'Solicitud actualizada exitosamente',
            solicitud
        });

    } catch (error) {
        console.error('Error al actualizar solicitud:', error);
        res.status(500).json({
            mensaje: 'Error al actualizar la solicitud',
            error: error.message
        });
    }
});

// Ver cursos aceptados (alumno)
app.get('/api/alumno/:id/cursos-aprobados', verificarToken, verificarRol(['alumno']), async (req, res) => {
    try {
        const cursosAprobados = await SolicitudCurso.findAll({
            where: {
                AlumnoId: req.usuario.id,
                EstadoSolicitud: 'aceptado'
            },
            include: [{
                model: Curso,
                include: [{
                    model: Usuario,
                    as: 'Profesor',
                    attributes: ['NombreCompleto', 'Telefono']
                }]
            }]
        });

        res.json(cursosAprobados);

    } catch (error) {
        console.error('Error al obtener cursos aprobados:', error);
        res.status(500).json({
            mensaje: 'Error al obtener los cursos aprobados',
            error: error.message
        });
    }
});

// GESTIÓN DE MATERIALES

// Subir material a un curso (profesor)
app.post('/api/materiales', verificarToken, verificarRol(['profesor']), verificarProfesorActivo, async (req, res) => {
    try {
        const { cursoId, titulo, enlace } = req.body;

        const curso = await Curso.findOne({
            where: {
                IdCurso: cursoId,
                ProfesorId: req.usuario.id
            }
        });

        if (!curso) {
            return res.status(404).json({
                mensaje: 'Curso no encontrado o no tienes permiso para modificarlo'
            });
        }

        const nuevoMaterial = await MaterialCurso.create({
            CursoId: cursoId,
            Titulo: titulo,
            Enlace: enlace
        });

        res.status(201).json({
            mensaje: 'Material agregado exitosamente',
            material: nuevoMaterial
        });

    } catch (error) {
        console.error('Error al agregar material:', error);
        res.status(500).json({
            mensaje: 'Error al agregar el material',
            error: error.message
        });
    }
});

// Ver materiales del curso (alumno aceptado)
app.get('/api/cursos/:id/materiales', verificarToken, verificarAccesoCurso, async (req, res) => {
    try {
        const { id } = req.params;

        const materiales = await MaterialCurso.findAll({
            where: { CursoId: id },
            order: [['FechaPublicacion', 'DESC']]
        });

        res.json(materiales);

    } catch (error) {
        console.error('Error al obtener materiales:', error);
        res.status(500).json({
            mensaje: 'Error al obtener los materiales',
            error: error.message
        });
    }
});

// ADMINISTRACIÓN DE USUARIOS (solo admin)

// Obtener todos los usuarios pendientes de aprobación
app.get('/usuarios/pendientes', verificarToken, verificarRol(['admin']), async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            where: { EstadoCuenta: 'pendiente' },
            include: [{
                model: Rol,
                attributes: ['NombreRol']
            }]
        });

        res.json(usuarios);

    } catch (error) {
        console.error('Error al obtener usuarios pendientes:', error);
        res.status(500).json({
            mensaje: 'Error al obtener los usuarios',
            error: error.message
        });
    }
});



// Iniciar el servidor
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});



