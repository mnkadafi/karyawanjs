var express = require('express')
var app = express()

app.get('/', function(req,res,next){
	req.getConnection(function(error,conn){
		conn.query('SELECT * FROM users ORDER BY id DESC', function(err, rows, fields){
			if(err){
				req.flash('error', err)
				res.render('user/list', {
					title: 'User list',
					data: ''
				})
			}else{
				res.render('user/list', {
					title: 'User list',
					data: rows
				})
			}
		})
	})
})

app.get('/add', function(req,res,next){
	res.render('user/add',{
		title: 'Add New User',
		username: '',
		password: '',
		hak_akses: ''
	})
})

app.post('/add', function(req,res,next){
	req.assert('username', 'Username harus diisi').notEmpty()
	req.assert('password', 'Passowrd harus diisi').notEmpty()
	req.assert('hak_akses', 'Hak Akses harus diisi').notEmpty()

	var errors = req.validationErrors();

	if(!errors){
		var user = {
			username: req.sanitize('username').escape().trim(),
			password: req.sanitize('password').escape().trim(),
			hak_akses: req.sanitize('hak_akses').escape().trim()
		}

		req.getConnection(function(error, conn){
			conn.query('INSERT INTO users SET ?', user, function(err, result){
				if(err){
					req.flash('error', err)
					res.render('user/add',{
						title: 'Add New User',
						username: user.username,
						password: user.password,
						hak_akses: user.hak_akses
					})
				}else{
					req.flash('succes','Data berhasil ditambahkan')
					res.render('user/add',{
						title: 'Add New User',
						username: '',
						password: '',
						hak_akses: ''
					})
				}
			})
		})
	}else{
		var error_msg = ''
		errors.forEach(function(error){
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)

		res.render('user/add', {
			title: 'Add New User',
			username: req.body.username,
			password: req.body.password,
			hak_akses: req.body.hak_akses,
		})
	}
})

app.get('/edit/(:id)', function(req,res,next){
	req.getConnection(function(error,conn){
		conn.query('SELECT * FROM users WHERE id='+ req.params.id, function(err,rows,fields){
			if(err){
				throw err
				if(rows.length<=0){
					req.flash('error', 'User tidak ditemukan dengan id ='+ req.params.id)
					res.redirect('/users')
				}
			}else{
				res.render('user/edit',{
					title: 'Edit User',
					id: rows[0].id,
					username: rows[0].username,
					password: rows[0].password,
					hak_akses: rows[0].hak_akses,
				})
			}
		})
	})
})

app.put('/edit/(:id)', function(req,res,next){
	req.assert('username','Username harus diisi').notEmpty()
	req.assert('password','Password harus diisi').notEmpty()
	req.assert('hak_akses','Hak Akses harus diisi').notEmpty()

	var errors = req.validationErrors()

	if(!errors){
		var user = {
			username: req.sanitize('username').escape().trim(),
			password: req.sanitize('password').escape().trim(),
			hak_akses: req.sanitize('hak_akses').escape().trim()
		}

		req.getConnection(function(error, conn){
			conn.query('UPDATE users SET ? WHERE id='+ req.params.id, user, function(err,result){
				if(err){
					req.flash('error', err)

					res.render('user/edit', {
						title: 'Edit User',
						id: req.params.id,
						username: req.body.username,
						password: req.body.password,
						hak_akses: req.body.hak_akses
					})
				}else{
					req.flash('success','Data berhasil di perbaharui')
					res.render('user/edit', {
						title: 'Edit User',
						id: req.params.id,
						username: req.body.username,
						password: req.body.password,
						hak_akses: req.body.hak_akses
					})
				}
			})
		})
	}else{
		var error_msg = ''
		errors.forEach(function(error){
			error_msg += errors.msg + '<br>'
		})
		req.flash('error' ,'error_msg')
		res.render('Edit User', {
			title: 'Edit User',
			username: req.param.username,
			password: req.param.password,
			hak_akses: req.param.hak_akses,
		})
	}
})

app.delete('/delete/(:id)', function(req,res,next){
	var user = {id: req.params.id}

	req.getConnection(function(error, conn){
		conn.query('DELETE FROM users WHERE id =' + req.params.id, user, function(err, result){
			if(err){
				req.flash('error', err)
				res.redirect('/users')
			}else{
				req.flash('success', 'User telah berhasil dihapus')
				res.redirect('/users')
			}
		})
	})
})

module.exports=app